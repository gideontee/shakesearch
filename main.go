package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"pulley.com/shakesearch/searcher"
)

func main() {
	searcher := searcher.Searcher{}
	err := searcher.Load("completeworks.txt")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	http.HandleFunc("/search", handleSearch(searcher))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Printf("Listening on port %s...", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}

func handleSearch(searcher searcher.Searcher) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		urlQueryValues := r.URL.Query()
		query, ok := urlQueryValues["q"]
		if !ok || len(query[0]) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing search query in URL params"))
			return
		}
		offset, ok := urlQueryValues["offset"]
		if !ok || len(offset[0]) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing offset in URL params"))
			return
		}
		offsetInt, err := strconv.Atoi(offset[0])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("offset param needs to be an integer"))
			return
		}
		contextLines, ok := urlQueryValues["contextlines"]
		if !ok || len(contextLines) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing contextlines in URL params"))
			return
		}
		contextLinesInt, err := strconv.Atoi(contextLines[0])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("contextlines param needs to be an integer"))
			return
		}
		caseSensitive, ok := urlQueryValues["case"]
		if !ok || len(caseSensitive) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing case in URL params"))
			return
		}
		caseSensitiveBool, err := strconv.ParseBool(caseSensitive[0])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("caseSensitive param needs to be an boolean"))
			return
		}
		results := searcher.Search(query[0], contextLinesInt, offsetInt, 10, caseSensitiveBool)
		resultsJson, err := json.Marshal(results)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("convert json failure"))
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(resultsJson)
	}
}
