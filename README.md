# Transparent Oil Namibia

The Transparent Oil Namibia platform maps the details, trends and connections in the allocation of Petroleum Exploration Licences in Namibia.

## Installing / Getting started

Requirements:

* [node.js](https://nodejs.org/en/)
* [Grunt](http://gruntjs.com/getting-started)

```shell
git clone THIS-REPO.git
cd THIS-REPO
npm install
grunt
```

This will run localPHP server and live reload the browser when the files change. At this point your default browser will open [http://localhost:9011/](http://localhost:9011/).

### Building for production

```shell
grunt build
```

This will compile everything for production in the `dist` folder.


### Deploying / Publishing - TODO

This repo deploys upon push to a managed VPS. 

### Data Model
The data is stored in [carto.com](http://carto.com) and fetched via [CARTO's SQL API](https://carto.com/docs/carto-engine/sql-api/).

![alt tag](images/data-model.png "The data model.")


## Licensing

One really important part: Give your project a proper license. Here you should
state what the license is and how to find the text version of the license.
Something like:

"The code in this project is licensed under MIT license."
