package cmd

import (
	"fmt"
	"os"
	"strings"

	"github.com/skumarspace/forge/common"
	"github.com/spf13/cobra"
)

// flags
var (
	port      string
	url       string
	imageUrl  string
	proxyAddr string
	mode  string
)

var rootCmd = &cobra.Command{
	Use:   "forge",
	Short: "Email template manager",
	Long: `A longer description that explains your CLI application
in detail. For example, you can mention the various commands
available and what they do.`,
	Run: func(cmd *cobra.Command, args []string) {
		// This function will be executed when the root command is called
		fmt.Println("Welcome to Forge! Use --help for more information.")
		if strings.HasPrefix(url, "file://") {
			cleanUrl, err := common.NormalizeLocalURL(url)
			if err != nil {
				fmt.Println("Error normalizing URL:", err)
				os.Exit(1)
			}

			url = cleanUrl
		}

		if strings.HasPrefix(imageUrl, "file://") {
			cleanImageUrl, err := common.NormalizeLocalURL(imageUrl)
			if err != nil {
				fmt.Println("Error normalizing Image URL:", err)
				os.Exit(1)
			}

			imageUrl = cleanImageUrl
		}

		err := common.HostServer(port, url, imageUrl, proxyAddr)
		if err != nil {
			fmt.Println("Error starting server:", err)
			os.Exit(1)
		}
	},
}

func init() {
	// Reverse Proxy to Vite
	rootCmd.Flags().StringVarP(&proxyAddr, "proxy", "x", "http://localhost:5173", "Proxy address for development mode")

	rootCmd.Flags().StringVarP(&port, "port", "p", "8080", "Port to start the server on")

	rootCmd.Flags().StringVarP(&url, "url", "u", "", "Storage Medium Url")
	rootCmd.MarkFlagRequired("url")

	rootCmd.Flags().StringVarP(&imageUrl, "imageUrl", "i", "", "Image URL for the email template")
	rootCmd.MarkFlagRequired("imageUrl")

	rootCmd.Flags().StringVarP(&mode, "mode", "m", "", "Storage provider")
	rootCmd.MarkFlagRequired("mode")
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
