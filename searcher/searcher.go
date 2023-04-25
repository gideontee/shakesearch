package searcher

import (
	"bufio"
	"fmt"
	"index/suffixarray"
	"os"
	"sort"
	"strings"
)

type Searcher struct {
	textByLine []string
}

type SearchResults struct {
	Rows   []ResultLine
	Offset int
}

type ResultLine struct {
	LineNumber int
	Context    map[int]string
}

func (s *Searcher) Load(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("Load: %w", err)
	}
	defer f.Close()

	fileScanner := bufio.NewScanner(f)
	for fileScanner.Scan() {
		s.textByLine = append(s.textByLine, fileScanner.Text())
	}
	return nil
}

func (s *Searcher) Search(query string, contextLines int, offsetLines int, limitResults int, caseSensitive bool) SearchResults {
	lineFoundCount := 0
	results := SearchResults{
		Rows: []ResultLine{},
	}
	for lineNum, line := range s.textByLine[offsetLines:] {
		foundIndices := s.findQuery(line, query, caseSensitive)
		results.Offset = lineNum + offsetLines + 1
		if len(foundIndices) > 0 {
			results.Rows = append(results.Rows, s.formatResults(query, contextLines, lineNum+offsetLines, foundIndices))
			lineFoundCount += 1
			if lineFoundCount == limitResults {
				break
			}
		}
	}
	return results
}

func (s *Searcher) findQuery(line string, query string, caseSensitive bool) [][]int {
	if !caseSensitive {
		line = strings.ToLower(line)
		query = strings.ToLower(query)
	}

	var queries []string
	if len(query) > 1 && query[0] == byte('"') && query[len(query)-1] == byte('"') {
		queries = []string{query[1 : len(query)-1]}
	} else {
		queries = strings.Split(query, " ")
	}

	idx := suffixarray.New([]byte(line))
	indices := [][]int{}

	for _, q := range queries {
		offsets := idx.Lookup([]byte(q), -1)
		for _, off := range offsets {
			indices = append(indices, []int{off, len(q)})
		}
	}
	sort.Slice(indices, func(i, j int) bool {
		return indices[i][0] < indices[j][0]
	})
	return indices
}

func (s *Searcher) formatResults(query string, contextlines int, foundLine int, foundIndices [][]int) ResultLine {
	result := ResultLine{
		Context:    make(map[int]string),
		LineNumber: foundLine + 1,
	}

	for i := foundLine - contextlines; i >= 0 && i < foundLine; i++ {
		result.Context[i+1] = s.textByLine[i]
	}
	result.Context[foundLine+1] = markResult(s.textByLine[foundLine], foundIndices)
	for i := foundLine + 1; i < len(s.textByLine) && i <= foundLine+contextlines; i++ {
		result.Context[i+1] = s.textByLine[i]
	}
	return result
}

func markResult(line string, indices [][]int) string {
	if len(indices) == 0 {
		return line
	}
	result := line[0:indices[0][0]]

	for i, idx := range indices {
		if i != 0 {
			result = result + line[indices[i-1][0]+indices[i-1][1]:indices[i][0]]
		}
		result = result + "<mark>" + line[idx[0]:idx[0]+idx[1]] + "</mark>"
	}

	result = result + line[indices[len(indices)-1][0]+indices[len(indices)-1][1]:]
	return result
}
