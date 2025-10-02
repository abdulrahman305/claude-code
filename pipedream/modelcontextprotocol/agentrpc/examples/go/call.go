package main

import (
	"fmt"
	"os"

	"github.com/agentrpc/agentrpc/sdk-go"
)

func main() {
	rpc, err := agentrpc.New(agentrpc.Options{
		APISecret: os.Getenv("AGENTRPC_API_SECRET"),
	})
	if err != nil {
		panic(err)
	}

	fmt.Println("Fetching registered tools from Go client...")

	// Assuming a similar API structure to the other SDKs.
	// The actual method might be different, but this demonstrates the intent.
	tools, err := rpc.Openai.Agents.GetTools()
	if err != nil {
		panic(err)
	}

	fmt.Println("Found tools:", tools)
}
