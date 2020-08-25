PB = $(wildcard *.proto)
JS = $(PB:.proto=.pb.js)

all: $(JS)

%.pb.js: %.proto
		protoc --js_out=import_style=commonjs,binary:. $<

clean:
		rm -f *.pb.js
		rm -f *.js
