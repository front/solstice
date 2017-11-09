
(function (ng) {
  'use strict';

  var solr = ng.module('solstice', []);

  /* Solr search service */
  solr.provider('Solstice', [function () {
    var defEndpoint = '';
    return {
      setEndpoint: function (url) {
        defEndpoint = url;
      },
      $get: ['$http', '$sce', function ($http, $sce) {
        function Solstice(endpoint) {
          this.search = function(options) {
            var url = $sce.trustAsResourceUrl(endpoint + '/select/');
            var defaults = {
              wt: 'json'
            };
            ng.extend(defaults, options);
            return $http.jsonp(url, {
              params: defaults,
              jsonpCallbackParam: 'json.wrf'
            });
          };
          this.withEndpoint = function (url) {
            return new Solstice(url);
          };
        }
        return new Solstice(defEndpoint);
      }]
    };
  }]);

  /* Solr search directive */
  solr.directive('solrSearch', [function() {
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
      controller: ['$scope', 'Solstice', function ($scope, Solstice) {
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

        searchServ.search(options)
        .then(function (_) {
          var res = _.data.response;
          var transScope = $scope.$$childHead || $scope.$$nextSibling;
          transScope.solr = {
            results: res.docs,
            count: res.numFound
          };
        })
        .catch(function (_) {
          window.console.error(_.data);
        });
      }]
    };
  }]);

})(window.angular);
