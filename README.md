Solstice
========
A simple Solr wrapper for AngularJS apps

Solstice is an AngularJS module, developed by [Frontkom](http://www.frontkom.no/), that enables simple querying of Solr indexes.
Solstice provides a search **service** and a companion **directive** that can be used in any Angularjs project.

Solstice is inspired by [Restangular](https://github.com/mgonto/restangular) - an Angularjs service to handle Rest API resources.

### Installation
Solstice can be installed using **Bower** or manually.

#### Using bower
```
bower install solstice
```


#### Manually
Clone or download this repository and add the **dist/solstice.js** or **dist/solstice.min.js** file to your html.

```
  <script type="text/javascript" src="/js/solstice.js"></script>

```


### Configuration

To use Solstice, just add it as a dependency to your app and set the default Solr index url in the config function.

```
var app = angular.module('my-app', ['solstice']);

app.config(function(SolsticeProvider) {
  SolsticeProvider.setEndpoint('url-to-your-index');
});

```


###Using Solstice


#### As service:
To use Solstice, you just need to add it as a dependency to the controller function.

```
app.controller('MyController', function($scope, Solstice) {
  Solstice.search({
      q: 'bundle:article AND status:true',
      fl: 'title, teaser, published',
      sort: 'published desc',
      rows: 10
  })
  .then(function (data){
    $scope.results = data.docs;
    console.log(data.docs);
  });
});
```

##### Using a Diferent endpoint

For some queries you may need to use a different index than the global one. In that case, you need to create a new service that extends Solstice.

In the following example, we create a new service called **Equinox** that uses a different Solr index.

```
app.provider('Equinox', function(Solstice) {
  return Solstice.withEndpoint('a-diferent-solr-index-url');
});

app.controller('AnotherController', function($scope, Equinox) {
  Equinox.search({
      q: '',
      fl: 'title, teaser, published'
      rows: 2
  })
  .then(function (data){
    $scope.results = data.docs;
    console.log(data.docs);
  });
});
```


####Usage as directive:
Solstice can also be used directly as a directive, if the use of the service is not required. This can be particularly usefull if the Solr querying is just a small part of a larger project.

To use it, just add the directive `solr-search` to any element in the html. This directive provides the following options:

- `index-url`: The Solr index to be used. Only required if it wasn't set in the config.
- `q`: The query string. See the Apache solr [documentation](http://wiki.apache.org/solr/SolrQuerySyntax) for details.
- `rows`: The number of results to retrieve.
- `start`: The number of results to skip.
- `sort`: The sort params.
- `fl`: The field list to be retrieved.

```
<any-tag solr-search index-url="your-index-url" start="0" rows="20"  >
  <header>
    <p>Found {{solr.found}} results.</p>
  </header>
  <ul>
    <li ng-repeat="item in solr.results">{{item.title}}</li>
  </ul>
</any-tag>
```
The module provides the $scope with a `solr` object. It has the following properties:

- `results`: the list of results
- `found`: the total number of results found.


##Future Features

- Full caching with Angularjs cacheFactory
- Support more SOLR features
- Querystring parsing
- Query language support

