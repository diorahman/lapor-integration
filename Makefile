test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
					--require should \
					--timeout 100000 \
					--bail \
					test.js
.PHONY: test
