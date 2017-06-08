# gossamer

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd gossamer`
* `npm install`
* `bower install`
* `ember install ember-moment`
* `ember install ember-cli-moment-shim` 
* `ember install semantic-ui-ember`
* `ember generate semantic-ui-ember`

## Semantic-UI
* `npm install -g gulp`
* pull out a terminal window and goto the project directory and then do `cd /bower_components/semantic-ui`
* run `npm install` and follow the default instrctions to install
* `Yes, extend my current settings.`
* `Automatic (Use defaults locations and all components)`
* `Do not remove Setup Files`
* `Yes to building semantic now`
* this would create a `site` that you can then modify to reflect changes over elements of semantic-ui
* make changes to `/globals/site.variables`, `/collections/menu.varibales`. To start, copy some of the variables and properties from `themes/default`
* then run `gulp build` once done with changes.
* or you can run `gulp watch` to watch changes and build the less files as you go.

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:8080).
* You could change the port in `.ember-cli`

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server` or `ember t -s` for short

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)