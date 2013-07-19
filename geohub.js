var request = require('request');

module.exports = {

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
          console.log(geojson);
          callback( null, geojson );
        } else {
          callback('Error: could not find any geojson in gist #' + id, null);
        }
      }
    });
    
  }

};
