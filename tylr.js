#!/usr/bin/env node

var fs = require('fs');

var argv = require('optimist')
    .usage('Usage: $0 -f [string] -d [string] -l [string]')
    .demand(['f','d'])
    .default('l', '0,5')
    .argv;



function tyle( file, dir, levels ){

  if ( !fs.existsSync( dir ) ) fs.mkdirSync( dir );

  fs.readFile( file, function( err, data ){
    var features = JSON.parse(data).features;
    
    features.forEach(function( f ){
      /*console.log( center( ( f.geometry.coordinates.length > 1 ) 
        ? f.geometry.coordinates[0] : f.geometry.coordinates ) );*/
      var ll = center( f.geometry.coordinates[0] )
      console.log(ll)

      //console.log(file, dir, levels);

      var z = parseInt(levels[0]);

      while ( z <= levels[ 1 ] ) {
        console.log('\t', locCoord(ll[1], ll[0], z));
        z++
      }
    });
  });

}

function center( coords ){
    //coords = coords[0];
    var minx = coords[0][0],
      miny = coords[0][1],
      maxx = coords[0][0],
      maxy = coords[0][1];

    var len = coords[0].length;
    /*while ( len-- ){
      var c = coords[0][len];
      minx = ( c[0] < minx ) ? c[0] : minx;
      miny = ( c[1] < miny ) ? c[1] : miny;
      maxx = ( c[0] > maxx ) ? c[0] : maxx;
      maxy = ( c[1] > maxy ) ? c[1] : maxy;
    }*/
    return [ (maxx + minx) / 2, (maxy + miny) / 2 ];
}

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

function locCoord(lat, lon, zoom){
  var lon_rad = lon * (Math.PI / 180),
    lat_rad = lat * (Math.PI / 180),
    n = Math.pow(2.0, zoom);

  var tileX = Math.floor( ( ( lon + 180 ) / 360 ) * n );
  var tileY = Math.floor( ( 1 - ( Math.log( Math.tan( lat_rad ) + 1.0 / Math.cos( lat_rad ) ) / Math.PI ) ) * n / 2.0 );

  return { x : tileX, y: tileY, z: zoom };
}


tyle( argv.f, argv.d, argv.l.split(',') );
