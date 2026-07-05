.PHONY: all build bin/opensettle clean

all: build

build: bin/opensettle

bin/opensettle:
	go build -o bin/opensettle ./cmd/opensettle

clean:
	rm -rf bin/
