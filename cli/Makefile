.PHONY: all build bin/debt-minimizer bin/expense-splitter bin/settle clean

all: build

build: bin/debt-minimizer bin/expense-splitter bin/settle

bin/debt-minimizer:
	go build -o bin/debt-minimizer ./cmd/debt-minimizer

bin/expense-splitter:
	go build -o bin/expense-splitter ./cmd/expense-splitter

bin/settle:
	go build -o bin/settle ./cmd/settle

clean:
	rm -rf bin/
