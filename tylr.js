var nfs = require('node-fs'),
  async = require('async');

module.exports = {

  tyle: function( file, dir, levels ){
    var self = this;

    console.log( file, dir, levels );

    if ( nfs.existsSync( file ) ) {
  
      nfs.readFile( file, function( err, data ){
        console.log('data', data)
        var features = JSON.parse(data).features;
  
        features.forEach(function( f ){
          var ll = self.center( f.geometry );
          console.log( ll );
  
          var z = parseInt( levels[0] );
  
          while ( z <= levels[ 1 ] ) {
            var xyz = self.location( ll[1], ll[0], z )
            self.q.push({ dir: dir, x: xyz.x, y: xyz.y, z: xyz.z, feature: f }, function (err) {} );
            z++;
          }
        });
      });
    } else {
      console.log('Can\'t find input geojson file');
    }

  },

  center: function( geom ){

    var minx, miny, maxx, maxy;

    function adjust( c ){
      var len = c.length;
      while ( len-- ){
        var p = c[len];
        minx = ( p[0] < minx ) ? p[0] : minx;
        miny = ( p[1] < miny ) ? p[1] : miny;
        maxx = ( p[0] > maxx ) ? p[0] : maxx;
        maxy = ( p[1] > maxy ) ? p[1] : maxy;
      }
    }

    if (geom.type == 'MultiPolygon'){
      var coords = geom.coordinates[0];
      minx = coords[0][0][0],
        miny = coords[0][0][1],
        maxx = coords[0][0][0],
        maxy = coords[0][0][1];
      geom.coordinates.forEach(function( polygon ){
        adjust( polygon[0] );
      });
    } else {
      var coords = geom.coordinates[0];
      minx = coords[0][0],
        miny = coords[0][1],
        maxx = coords[0][0],
        maxy = coords[0][1];
      
      adjust( geom.coordinates[0] ); 
    }
    return [ (maxx + minx) / 2, (maxy + miny) / 2 ];
  },

  location: function( lat, lon, zoom ) {
    var lon_rad = lon * (Math.PI / 180),
      lat_rad = lat * (Math.PI / 180),
      n = Math.pow(2.0, zoom);
  
    var tileX = Math.floor( ( ( lon + 180 ) / 360 ) * n );
    var tileY = Math.floor( ( 1 - ( Math.log( Math.tan( lat_rad ) + 1.0 / Math.cos( lat_rad ) ) / Math.PI ) ) * n / 2.0 );
  
    return { x : tileX, y: tileY, z: zoom };
  },

  q: async.queue(function (task, callback) {

    var p = [task.dir, task.z, task.x].join('/');
    var file = p + '/' + task.y + '.png';

    nfs.mkdir( p, '0777', true, function(){
      if ( !nfs.existsSync( file ) ) {
        nfs.writeFile( file, JSON.stringify({ type:'FeatureCollection', features: [ task.feature ] }));
        callback();
      } else {
        nfs.readFile( file, function(err, data){
          var json = JSON.parse(data.toString());
          json.features.push( task.feature );

          nfs.writeFile( file, JSON.stringify( json ));
          callback();
        })
      }
    });

  }, 2)


};
  

/*function centroid( coords ){
  var area = 0;
  var p1, p2, f;
  var x = 0, y = 0;

  coords.forEach(function(c){
    var nPts = c.length;

    for ( var i=0; i < nPts; j = i++ ) {
      var j = nPts - 1;
      p1 = c[i];
      p2 = c[j];
      area += p1[1] * p2[0];
      area -= p1[0] * p2[1];

      f = p1[1] * p2[0] - p2[1] * p1[0];

      x += ( p1[1] + p2[1] ) * f;
      y += ( p1[0] + p2[0] ) * f;
    }
  });

  f = area * 3;
  return [ x/f + coords[0][0][0], y/f + coords[0][0][1] ];
}*/
