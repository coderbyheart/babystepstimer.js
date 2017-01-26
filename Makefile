.PHONY: build

build/babystepstimer.js: dist
	./node_modules/.bin/browserify dist/babystepstimer.js -o $@

dist: src/*.js
	rm -rf $@
	./node_modules/.bin/babel src -d $@

build/index.html: src/index.html build/sounds/struck.wav build/sounds/shipsbell.wav
	cp $< $@

build/sounds/%.wav: sounds/%.wav
	mkdir -p $(dir $@)
	cp $< $@

build: build/index.html build/babystepstimer.js
