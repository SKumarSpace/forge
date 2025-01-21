package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net/http"

	"gocloud.dev/blob"
	_ "gocloud.dev/blob/fileblob" // Import fileblob as a backend for Blob storage
)

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

func main() {
	// Open a Blob bucket backed by local file storage.
	bucket, err := blob.OpenBucket(context.Background(), "file://./templates") // Saving to the current directory
	if err != nil {
		log.Fatal(err)
	}
	defer bucket.Close()

	// Create a new ServeMux (multiplexer)
	mux := http.NewServeMux()

	// Define the save handler
	mux.HandleFunc("/save", func(w http.ResponseWriter, r *http.Request) {
		// Parse the filename from the URL query parameter
		filename := r.URL.Query().Get("filename")
		if filename == "" {
			http.Error(w, "filename is required", http.StatusBadRequest)
			return
		}

		// Read the HTML body from the request
		var buf bytes.Buffer
		_, err := buf.ReadFrom(r.Body)
		if err != nil {
			http.Error(w, "Error reading body", http.StatusInternalServerError)
			return
		}

		// Print the HTML body to the console
		fmt.Println("Received HTML Body:")
		fmt.Println(buf.String())

		// Write the body content to the Blob storage (file system in this case)
		err = bucket.WriteAll(r.Context(), filename, buf.Bytes(), nil)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		// Respond to the client
		w.Write([]byte("File saved successfully"))
	})

	// Apply the CORS middleware to all routes
	http.Handle("/", withCORS(mux))

	// Start the HTTP server
	port := "8080"
	log.Printf("Server started at http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
