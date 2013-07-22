geohub 
====

Simple GeoJSON extractor from Github repos and Gists

## Install

    npm install geohub

## Usage 

    // Extract GeoJSON from a gist 
    Geohub = require('geohub');
    var gist = 6021269;
    Geohub.gist( gist, function( err, data ){
      console.log( data );
    });

    // Extract GeoJSON from a repo 
    var user = 'colemanm', 
      repo = 'hurricanes'
      path = 'fl_2004_hurricanes';

    Geohub.github( user, repo, path, function( err, data ){
      console.log( data );
    });
