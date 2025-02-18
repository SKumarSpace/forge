package common

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"gocloud.dev/blob"

	_ "gocloud.dev/blob/azureblob" // Import azureblob as a backend for Blob storage
	_ "gocloud.dev/blob/fileblob"  // Import fileblob as a backend for Blob storage
	_ "gocloud.dev/blob/s3blob"    // Import s3blob as a backend for Blob storage
)

/*JSON*/
type EmailLayout struct {
	Title string `json:"title"`
	ID    string `json:"id"`
}

type Root struct {
	Type string      `json:"type"`
	Data EmailLayout `json:"data"`
}

type EmailLayoutRoot struct {
	Root Root `json:"root"`
}

// CORS Middleware to handle cross-origin requests
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow cross-origin requests from any domain
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// If it's a preflight request (OPTIONS), just return
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler for actual request processing
		next.ServeHTTP(w, r)
	})
}

func getProviderName(bucketURL string) string {
	u, err := url.Parse(bucketURL)
	if err != nil {
		log.Fatalf("Failed to parse bucket URL: %v", err)
	}
	// Extract provider based on the scheme
	switch strings.ToLower(u.Scheme) {
	case "s3":
	case "azblob":
	case "file":
		return u.Scheme
	default:
		return "Unknown Provider"
	}

	return u.Scheme
}

func getPublicBaseUrl(provider, key string) string {
	switch provider {
	case "s3":
		return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", os.Getenv("AWS_IMAGE_BUCKET"), os.Getenv("AWS_IMAGE_REGION"), key)
	case "azblob":
		return fmt.Sprintf("https://%s.blob.core.windows.net/images/%s", os.Getenv("AZURE_STORAGE_ACCOUNT"), key)
	default:
		return "Unknown Provider"
	}
}

func HostServer(port string, directory string, imageUrl, proxyAddr string) error {
	// Open a Blob bucket backed by local file storage.
	bucket, err := blob.OpenBucket(context.Background(), directory) // Saving to the current directory
	if err != nil {
		return fmt.Errorf("failed to open bucket: %w", err)
	}
	defer bucket.Close()

	// Open Image bucket
	imageBucket, err := blob.OpenBucket(context.Background(), imageUrl) // Saving to the current directory
	if err != nil {
		return fmt.Errorf("failed to open image bucket: %w", err)
	}

	defer imageBucket.Close()

	imageBucketProvider := getProviderName(imageUrl)

	// Create a new ServeMux (multiplexer)
	mux := http.NewServeMux()

	// Check if in debug mode
	if os.Getenv("DEBUG") == "true" {
		proxyURL, _ := url.Parse(proxyAddr)
		proxy := httputil.NewSingleHostReverseProxy(proxyURL)
		mux.Handle("/", proxy)
	} else {
		mux.Handle("/", http.FileServer(http.Dir("client/dist")))
	}

	// Define the save handler
	mux.HandleFunc("POST /save", func(w http.ResponseWriter, r *http.Request) {
		d := json.NewDecoder(r.Body)
		d.DisallowUnknownFields()

		// anonymous struct type: handy for one-time use
		t := struct {
			Filename      string `json:"filename"`
			HTML          string `json:"html"`
			Configuration string `json:"configuration"`
		}{}

		err := d.Decode(&t)
		if err != nil {
			// bad JSON or unrecognized json field
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Write the body content to the Blob storage (file system in this case)
		err = bucket.WriteAll(r.Context(), t.Filename+".html", []byte(t.HTML), nil)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		// Write the configuration to the Blob storage
		err = bucket.WriteAll(r.Context(), t.Filename+".json", []byte(t.Configuration), nil)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		// Respond to the client
		w.Write([]byte("File saved successfully"))
	})

	// Define the delete handler
	mux.HandleFunc("DELETE /delete", func(w http.ResponseWriter, r *http.Request) {
		d := json.NewDecoder(r.Body)
		d.DisallowUnknownFields()

		// Define a struct for the incoming JSON
		t := struct {
			Filename string `json:"filename"`
		}{}

		err := d.Decode(&t)
		if err != nil {
			// Handle bad JSON or unrecognized fields
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Delete the HTML file from Blob storage
		err = bucket.Delete(r.Context(), t.Filename+".html")
		if err != nil {
			http.Error(w, "Error deleting HTML file", http.StatusInternalServerError)
			return
		}

		// Delete the JSON configuration file from Blob storage
		err = bucket.Delete(r.Context(), t.Filename+".json")
		if err != nil {
			http.Error(w, "Error deleting configuration file", http.StatusInternalServerError)
			return
		}

		// Respond to the client
		w.Write([]byte("File deleted successfully"))
	})

	// Define the list handler
	mux.HandleFunc("GET /list", func(w http.ResponseWriter, r *http.Request) {
		// List all the files in the bucket
		filenames := make(map[string]string)
		iter := bucket.List(nil)
		for {
			obj, err := iter.Next(context.Background())
			if err == io.EOF {
				break
			}
			if err != nil {
				http.Error(w, "error listing files", http.StatusInternalServerError)
				return
			}

			if !strings.HasSuffix(obj.Key, ".json") {
				continue
			}

			// Read the file from the Blob storage
			reader, err := bucket.NewReader(r.Context(), obj.Key, nil)
			if err != nil {
				http.Error(w, "error reading file", http.StatusInternalServerError)
				return
			}
			defer reader.Close()

			// Deserialize the JSON configuration
			var config EmailLayoutRoot
			err = json.NewDecoder(reader).Decode(&config)
			if err != nil {
				http.Error(w, "error decoding JSON", http.StatusInternalServerError)
				return
			}

			// Add the title to the list of filenames
			filenames[obj.Key] = config.Root.Data.Title
		}

		// Respond to the client with the list of filenames
		j, err := json.Marshal(filenames)
		if err != nil {
			http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(j)
	})

	// Define the get handler
	mux.HandleFunc("GET /get", func(w http.ResponseWriter, r *http.Request) {
		// Parse the filename from the URL query parameter
		filename := r.URL.Query().Get("filename")
		if filename == "" {
			http.Error(w, "filename is required", http.StatusBadRequest)
			return
		}

		// Read the file from the Blob storage
		reader, err := bucket.NewReader(r.Context(), filename, nil)
		if err != nil {
			http.Error(w, "error reading file", http.StatusInternalServerError)
			return
		}
		defer reader.Close()

		// Write the file content to the response
		w.Header().Set("Content-Type", "application/json")
		io.Copy(w, reader)
	})

	// IMAGE HANDLERS
	mux.HandleFunc("GET /images/list", func(w http.ResponseWriter, r *http.Request) {
		// List all the files in the bucket
		filenames := make(map[string]string)
		iter := imageBucket.List(nil)
		for {
			obj, err := iter.Next(context.Background())
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatal(err)
			}

			url := getPublicBaseUrl(imageBucketProvider, obj.Key)
			filenames[obj.Key] = url
		}

		// Respond to the client with the list of filenames
		j, err := json.Marshal(filenames)
		if err != nil {
			http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(j)
	})

	mux.HandleFunc("POST /images/upload", func(w http.ResponseWriter, r *http.Request) {
		// Parse the filename from the URL query parameter
		filename := r.URL.Query().Get("filename")
		if filename == "" {
			http.Error(w, "filename is required", http.StatusBadRequest)
			return
		}

		// Parse the multipart form
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			http.Error(w, "error parsing form", http.StatusInternalServerError)
			return
		}

		// Retrieve the file from form data
		file, _, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "error retrieving file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		// Read the file content
		body, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, "error reading file", http.StatusInternalServerError)
			return
		}

		// Upload the file to the Blob storage
		err = imageBucket.WriteAll(r.Context(), filename, body, nil)
		if err != nil {
			http.Error(w, "error uploading file", http.StatusInternalServerError)
			return
		}

		// Respond to the client
		w.Write([]byte("File uploaded successfully"))
	})

	// Apply the CORS middleware to all routes
	http.Handle("/", withCORS(mux))

	// Start the HTTP server
	log.Printf("Server started at http://localhost:%s", port)
	return http.ListenAndServe(":"+port, nil)
}

func NormalizeLocalURL(url string) (string, error) {
	url = url[7:] // Remove the file:// prefix
	fullUrl, err := filepath.Abs(url)
	if err != nil {
		return "", err
	}

	// Make directory if it doesn't exist
	if _, err := os.Stat(fullUrl); os.IsNotExist(err) {
		err := os.MkdirAll(fullUrl, os.ModePerm)
		if err != nil {
			return "", err
		}
	}

	// Convert Windows path to use forward slashes
	if runtime.GOOS == "windows" {
		fullUrl = "/" + strings.ReplaceAll(fullUrl, "\\", "/")
	}

	return fmt.Sprintf("file://%s", fullUrl), nil
}
