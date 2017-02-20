# widgetdemo2017
HTML5 Canvas Widget Demo

Simple demo of HTML5 Canvas rendering. No external dependencies (except for unit test dependencies).

## Try It Out
View the [demo](https://skyschulz.github.io/widgetdemo2017/).

Note: currently only loads correctly under Chrome (after allowing insecure content for the URL), due to CSP restrictions. Otherwise, it uses a local fallback of the scoreboard data.

## Testing
Unit tests are written using the [Jasmine](https://jasmine.github.io) test framework.

To run the unit tests, the following must be installed:
 * [node.js](https://nodejs.org/en/)
 * `npm install karma-jasmine karma-chrome-launcher jasmine-core --save-dev`
 * `npm install karma-cli` or `sudo npm install -g karma-cli`