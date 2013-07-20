var request = require('request'),
  GitHubApi = require('github');

var github = new GitHubApi({
  version: "3.0.0",
  timeout: 5000
}); 

module.exports = {

  // scan repo for "geojson files"
  repo: function( user, repo, path, callback ){
    var url = 'https://raw.github.com/'+ user + '/' + repo + '/master/' + path + '.geojson';
    request(url, function( error, response, body ){
      if (!error && response.statusCode == 200) {
        var json = JSON.parse( body );
        try {
          if (json.type && json.type == 'FeatureCollection'){
            callback( null, json );
          }
        } catch (e){
          callback('Error: could not parse file contents' + e, null);
        }
      }
    });
  },

  gist: function( id, callback ){
    var url = 'https://api.github.com/gists/' + id;
    request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var files = JSON.parse( body ).files,
          geojson = [];

        for ( var f in files ){
          var file = files[f],
            content = file.content;

          try {
            var json = JSON.parse( content );
            if (json.type && json.type == 'FeatureCollection'){
              geojson.push( json );
            }
          } catch (e){
            callback('Error: could not parse file contents'+e, null);
          }

        }
        // got some geojson 
        if ( geojson.length ){
          callback( null, geojson );
        } else {
          callback('Error: could not find any geojson in gist #' + id, null);
        }
      }
    });
    
  }

};
