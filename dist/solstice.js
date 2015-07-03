/**
 * A simple Solr wrapper for AngularJS apps
 * @version v0.1 - 2015-07-03
 * @link https://github.com/front/solstice
 * @author Élio Cró <elio@front.no>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (ng) {
  'use strict';

  var solr = ng.module('solstice', []);

  /* Solr search service */
  function SolsticeProvider() {
    var defEndpoint = '';
    function $get($http) {
      function Solstice(endpoint) {
        this.search = function(options) {
          var url = endpoint + '/select/';
          var defaults = {
            wt: 'json',
            'json.wrf': 'JSON_CALLBACK'
          };
          ng.extend(defaults, options);
          return $http.jsonp(url, {
            params: defaults
          });
        };
        this.withEndpoint = function (url) {
          return new Solstice(url);
        };
      }
      return new Solstice(defEndpoint);
    }
    function setEndpoint(url) {
      defEndpoint = url;
    }

    return {
      $get: [ '$http', $get ],
      setEndpoint: setEndpoint
    }
  }

  /* Solr search directive */
  function directive() {
    /* Solr search directive controller */
    function controller($scope, $rootScope, Solstice) {
      var searchServ = !$scope.indexUrl ? Solstice :
          Solstice.withEndpoint($scope.indexUrl);

      var options = {
        q: $scope.q || '*:*',
        start: $scope.start || 0,
        rows: $scope.rows || 10
      };
      if($scope.sort) {
        options.sort = $scope.sort;
      }
      if($scope.fl) {
        options.fl = $scope.fl;
      }

      searchServ.search(options).then(function (data) {
        var res = data.data.response;
        var transScope = $scope.$$nextSibling;
        transScope.solr = $rootScope.solr || {};
        transScope.solr.results = res.docs;
        transScope.solr.count = res.numFound;
      });
    }

    return {
      restrict: 'AE',
      transclude: true,
      replace: false,
      template: '<div ng-transclude></div>',
      scope: {
        q: '@query',
        start: '@',
        rows: '@',
        sort: '@',
        fl: '@fields',
        indexUrl: '@'
      },
      controller: [ '$scope', '$rootScope', 'Solstice', controller ]
    };
  }

  solr.provider('Solstice', [ SolsticeProvider ]);
  solr.directive('solrSearch', [ directive ]);

})(window.angular);

