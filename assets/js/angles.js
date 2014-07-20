var monthConverter = function(index) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[index];
}
var deindexer = function(index) {
  var arr = []
  for(var i=index;i<13;++i){
    arr.push(monthConverter(i-1));
  }
  for(var i=1;i<index;++i){
    arr.push(monthConverter(i-1));
  }
  console.log(arr);
  return arr;
} 

var generateC3Graph = function(bind, data, width) {
  var chart = c3.generate({
    bindto: bind,
    data: {
      columns: [
        (['data1']).concat(data)
      ],
      types: {
        data1: 'area'
      }
    },
    axis: {
      x: {
        type: 'category',
        categories: deindexer(moment().month()+2),
      }
    },
    size: {
      height: 240,
      width: width
    },
    tooltip: {
      show: false
    },
    legend: {
      show: false
    }
  });
  return chart;
}

var inHouseApp = angular.module('inHouseApp', ['ngRoute']);

// angular routes
inHouseApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/_featured',
      controller: 'FeaturedCtrl'
    })
    .when('/popular', {
      templateUrl: '/partials/_popular',
      controller: 'PopularCtrl'
    })
    .when('/recent', {
      templateUrl: '/partials/_recent',
      controller: 'RecentCtrl'
    })
    .when('/search', {
      templateUrl: '/partials/_search',
      controller: 'SearchCtrl'
    })
    .when('/profile', {
      templateUrl: '/partials/_profile',
      controller: 'ProfileCtrl'
    })
    .when('/concept/add', {
      templateUrl: '/partials/_concept_add',
      controller: 'ConceptAddCtrl'
    })
    .when('/concept/:id', {
      templateUrl: '/partials/_concept_view',
      controller: 'ConceptViewCtrl'
    })
    .when('/concept/:id/edit', {
      templateUrl: '/partials/_concept_edit',
      controller: 'ConceptEditCtrl'
    })
    .otherwise({
      templateUrl: '/partials/_featured',
      controller: 'FeaturedCtrl'
    });
});

// controllers
inHouseApp.controller('Ctrl', function($scope) {});//default scope

inHouseApp.controller('FeaturedCtrl', function($scope, $http, $q) {
  var deferred = $q.defer();
  $scope.reference_name = 'featured';
  var query = 'SELECT+name+FROM+Concept__c';
  var url = sr.context.links.queryUrl + "?q=" + query;
  var concepts = [];
  Sfdc.canvas.client.ajax(url,
    {client: sr.client,
    success: function(data){
      if (data.status == 200) {
        var records = data.payload.records;
        for(i=0;i<records.length;++i){
          console.log(records[i].attributes.url);
          Sfdc.canvas.client.ajax(records[i].attributes.url,
          {client: sr.client,
          success: function(data2){
            if (data2.status == 200) {
              concepts.push(data2);
              if(concepts.length==records.length){
                deferred.resolve(concepts);
                deferred.promise.then(function(concepts_data){
                  concepts_data.sort(function(a, b){
                    return b.payload.TotalTokens__c - a.payload.TotalTokens__c;
                  });
                  $scope.concepts = concepts_data.slice(0, 3);
                });
              }
            }
          }});
        }
      }
    }});
});
inHouseApp.controller('PopularCtrl', function($scope, $http, $q) {
  var deferred = $q.defer();
  $scope.reference_name = 'popular';
  var query = 'SELECT+name+FROM+Concept__c';
  var url = sr.context.links.queryUrl + "?q=" + query;
  var concepts = [];
  Sfdc.canvas.client.ajax(url,
    {client: sr.client,
    success: function(data){
      if (data.status == 200) {
        var records = data.payload.records;
        for(i=0;i<records.length;++i){
          console.log(records[i].attributes.url);
          Sfdc.canvas.client.ajax(records[i].attributes.url,
          {client: sr.client,
          success: function(data2){
            if (data2.status == 200) {
              concepts.push(data2);
              if(concepts.length==records.length){
                deferred.resolve(concepts);
                deferred.promise.then(function(concepts_data){
                  concepts_data.sort(function(a, b){
                    return b.payload.TotalTokens__c - a.payload.TotalTokens__c;
                  });
                  console.log(concepts_data);
                  $scope.concepts = concepts_data.slice(0, 5);
                })
              }
            }
          }});
        }
      }
    }});
});
inHouseApp.controller('RecentCtrl', function($scope, $http, $q) {
  var deferred = $q.defer();
  $scope.reference_name = 'recent';
  var query = 'SELECT+name+FROM+Concept__c';
  var url = sr.context.links.queryUrl + "?q=" + query;
  var concepts = [];
  Sfdc.canvas.client.ajax(url,
    {client: sr.client,
    success: function(data){
      if (data.status == 200) {
        var records = data.payload.records;
        for(i=0;i<records.length;++i){
          console.log(records[i].attributes.url);
          Sfdc.canvas.client.ajax(records[i].attributes.url,
          {client: sr.client,
          success: function(data2){
            if (data2.status == 200) {
              concepts.push(data2);
              if(concepts.length==records.length){
                deferred.resolve(concepts);
                deferred.promise.then(function(concepts_data){
                  concepts_data.sort(function(a, b){
                    return moment(b.payload.GenerationDate__c) - moment(a.payload.GenerationDate__c);
                  });
                  $scope.concepts = concepts_data.slice(0, 5);
                })
              }
            }
          }});
        }
      }
    }});
});
inHouseApp.controller('SearchCtrl', function($scope, $q) {
  $scope.reference_name = 'results';
  $('#search-go').click(function(){
    var search_term = $('#search-bar').val();
    console.log(search_term);
    var deferred = $q.defer();
    var query = 'SELECT+name+FROM+Concept__c';
    var url = sr.context.links.queryUrl + "?q=" + query;
    var concepts = [];
    Sfdc.canvas.client.ajax(url,
      {client: sr.client,
      success: function(data){
        if (data.status == 200) {
          var records = data.payload.records;
          for(i=0;i<records.length;++i){
            Sfdc.canvas.client.ajax(records[i].attributes.url,
            {client: sr.client,
            success: function(data2){
              if (data2.status == 200) {
                concepts.push(data2);
                if(concepts.length==records.length){
                  deferred.resolve(concepts);
                  deferred.promise.then(function(concepts_data){
                    var filtered = []
                    for(var k=0;k<concepts_data.length;++k){
                      if ((concepts_data[k].payload.Name.toLowerCase()).indexOf(search_term.toLowerCase()) > -1){
                        filtered.push(concepts_data[k]);
                      }
                    }
                    filtered.sort(function(a, b){
                      return b.payload.TotalTokens__c - a.payload.TotalTokens__c;
                    });
                    $scope.concepts = filtered;
                  });
                }
              }
            }});
          }
        }
      }});
  })
});
inHouseApp.controller('ProfileCtrl', function($scope, $q) {
  $scope.reference_name = 'profile';
  $scope.first_name = sr.context.user.firstName;
  $scope.last_name = sr.context.user.lastName;
  $scope.email = sr.context.user.email;
  $scope.tokens = 100;
  var deferred = $q.defer();
  $scope.reference_name = 'featured';
  var query = "SELECT+name+FROM+Concept__c+WHERE+CreatedById+=+'"+sr.context.user.userId+"'";
  var url = sr.context.links.queryUrl + "?q=" + query;
  console.log(url);
  var concepts = [];
  Sfdc.canvas.client.ajax(url,
    {client: sr.client,
    success: function(data){
      if (data.status == 200) {
        var records = data.payload.records;
        for(i=0;i<records.length;++i){
          console.log(records[i].attributes.url);
          Sfdc.canvas.client.ajax(records[i].attributes.url,
          {client: sr.client,
          success: function(data2){
            if (data2.status == 200) {
              concepts.push(data2);
              if(concepts.length==records.length){
                deferred.resolve(concepts);
                deferred.promise.then(function(concepts_data){
                  console.log(concepts_data);
                  // add sorting code ?>???>??>>>??
                  $scope.concepts = concepts_data.slice(0, 5);
                });
              }
            }
          }});
        }
      }
    }});
});
inHouseApp.controller('ConceptViewCtrl', function($scope, $location, $q) {
  console.log($location.path());
  $scope.reference_name = 'view concept';
  var deferred = $q.defer();
  var loc_params = $location.path().split('/');
  var id = loc_params[loc_params.length-1];
  var url = '/services/data/v31.0/sobjects/Concept__c/'+ id;
  var concepts = [];
  Sfdc.canvas.client.ajax(url,
    {client: sr.client,
    success: function(data){
      if (data.status == 200) {
        deferred.resolve(data);
        deferred.promise.then(function(data){
          $scope.concept = data;
          var width = $('.box').width();
          var chart_data = data.payload.PastTokens__c.split(',');
          var chart = generateC3Graph('#chart', chart_data, width);
        })
      }
    }
  });
  $(".buy-stock").click(function(){
    console.log("Good for you!");
    // sf_PATCH(sr, url, body);
    // $location.path('/featured');
  });
});
inHouseApp.controller('ConceptAddCtrl', function($scope, $location) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 
  today = yyyy+'/'+mm+'/'+dd;
  $scope.reference_name = 'add concept';
  $('.submit').click(function(){
    var url = "/services/data/v29.0/sobjects/Concept__c";
    var data_title = $('#data-title').val()
    var data_abstract = $('#data-abstract').val()
    var data_body = $('#data-body').val()
    var data_tags = $('#data-tags').val()
    var author = sr.context.user.firstName + ' ' + sr.context.user.lastName
    var body = {
      "name": data_title,
      "Abstract__c": data_abstract,
      "GenerationDate__c": today,
      "TotalTokens__c" : "1",
      "ExpirationDate__c": "2016-12-02",
      "Body__c": data_body,
      "Author__c" : author
    };
    sf_POST(sr, url, body);
  });
});
inHouseApp.controller('ConceptEditCtrl', function($scope, $location, $q) {
  $scope.reference_name = 'edit concept';
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 
  today = yyyy+'/'+mm+'/'+dd;
  var deferred = $q.defer();
  var loc_params = $location.path().split('/');
  var id = loc_params[loc_params.length-2];
  var url = '/services/data/v31.0/sobjects/Concept__c/'+ id;
  var concepts = [];
  Sfdc.canvas.client.ajax(url,
    {client: sr.client,
    success: function(data){
      if (data.status == 200) {
        deferred.resolve(data);
        deferred.promise.then(function(data){
          console.log(data);
          $scope.concept = data;
        })
      }
    }
  });
  $('.submit').click(function(){
    var url = "/services/data/v29.0/sobjects/Concept__c";
    var data_title = $('#data-title').val()
    var data_abstract = $('#data-abstract').val()
    var data_body = $('#data-body').val()
    var data_tags = $('#data-tags').val()
    var author = sr.context.user.firstName + ' ' + sr.context.user.lastName
    var body = {
      "name": data_title,
      "Abstract__c": data_abstract,
      "GenerationDate__c": today,
      "TotalTokens__c" : "1",
      "ExpirationDate__c": "2016-12-02",
      "Body__c": data_body,
      "Author__c" : author
    };
    sf_POST(sr, url, body);
  });
});