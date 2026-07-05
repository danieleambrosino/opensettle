.PHONY: all build bin/debt-minimizer bin/expense-splitter bin/opensettle clean

all: build

build: bin/debt-minimizer bin/expense-splitter bin/opensettle

bin/debt-minimizer:
	go build -o bin/debt-minimizer ./cmd/debt-minimizer

bin/expense-splitter:
	go build -o bin/expense-splitter ./cmd/expense-splitter

bin/opensettle:
	go build -o bin/opensettle ./cmd/opensettle

clean:
	rm -rf bin/
