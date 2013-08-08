var request = require('request');

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

  gist: function( options, callback ){
    var url = 'https://api.github.com/gists/' + options.id + ((options.token) ? '?access_token=' + options.token : '');
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
