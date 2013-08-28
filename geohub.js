var request = require('request');

module.exports = {

  // scan repo for "geojson files"
  repo: function( user, repo, path, callback ){
    var self = this;
    if ( user && repo && path ){ 
      var url = 'https://raw.github.com/'+ user + '/' + repo + '/master/' + path + '.geojson';
      request(url, function( error, response, body ){
        if (!error && response.statusCode == 200) {
          var geojson = null;
          try {
            var json = JSON.parse( body );
            if (json.type && json.type == 'FeatureCollection'){
              geojson = json;
            }
          } catch (e){
            callback('Error: could not parse file contents' + e, null);
            return;
          }
          
          if ( geojson ) {
            callback( null, geojson );
          } else {
            callback('Error: could not find any geojson at ' + url, null);
          }
        } else if (response.statusCode == 404) {
          callback("File not found at: " + url, null);
        } else {
          callback("Error '" + error + "' occurred reading from " + url, null);
        }
      });
    } else if ( user && repo ){
      // scan the repo contents 
      var url = 'https://api.github.com/repos/'+ user + '/' + repo + '/contents';
      request(url, function( error, response, body ){
        if (!error && response.statusCode == 200) {
          var files = [];
          var json = JSON.parse( body );
          json.forEach(function( file ){
            if (file.name.match(/geojson/)){
              files.push(file);
            }
          });
          if ( files.length ){ 
            self.getRepoFiles( 'https://raw.github.com/'+ user + '/' + repo + '/master/', files, callback );
          } else {
            callback('Error: could not find any geojson at ' + url, null);
          }
        } else {
          callback('Error: ' + error, null);
        }
      });
    } else {
      callback("Error: must specify at least a username and repo");
    }
  },

  getRepoFiles: function( url, files, callback ){
    var data = [],
      errorCatch = false,
      json;

    var done = function( fname ){
      if (data.length == files.length){
        callback( null, data);
      } else if ( errorCatch ){
        callback( 'Error: could not access file ' + url + '/' + fname , null );
      }   
    }

    files.forEach(function( f ){
      request( url + f.name, function( error, response, body ){
        if (!error && response.statusCode == 200) {
          try {
            json = JSON.parse( body );
            if (json.type && json.type == 'FeatureCollection'){
              json.name = f.name;
              data.push( json );
            }
          } catch (e){
            errorCatch = true;
          }
        } else {
          errorCatch = true;
        }
        done( f.name );
      });
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
              json.name = file.filename;
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
      } else if (response.statusCode == 404) {
        callback("Gist not found at: " + url, null);
      } else {
        callback("Error '" + error + "' occurred reading from " + url, null);
      }
    });
    
  }
};
