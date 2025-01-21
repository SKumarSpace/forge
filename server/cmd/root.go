package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/skumarspace/forge/common"
	"github.com/spf13/cobra"
)

// flags
var (
	port string
	url  string
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
			url = url[7:] // Remove the file:// prefix
			fullUrl, err := filepath.Abs(url)
			if err != nil {
				fmt.Println("Error getting absolute path:", err)
				os.Exit(1)
			}

			url = fmt.Sprintf("file://%s", fullUrl)
		}
		common.HostServer(port, url)
	},
}

func Execute() {
	rootCmd.Flags().StringVarP(&port, "port", "p", "8080", "Port to start the server on")
	rootCmd.Flags().StringVarP(&url, "url", "u", "", "Storage Medium Url")
	rootCmd.MarkFlagRequired("directory")

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
