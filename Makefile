.PHONY: all build clean

all: build

build: bin/debt-minimizer bin/expense-splitter

bin/debt-minimizer:
	go build -o bin/debt-minimizer ./cmd/debt-minimizer

bin/expense-splitter:
	go build -o bin/expense-splitter ./cmd/expense-splitter

clean:
	rm -rf bin/
