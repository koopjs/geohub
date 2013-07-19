geohub 
====

Simple GeoJSON extractor from Github repos and Gists

## Install

    npm install geohub

## Usage 

    // Extract GeoJSON from a gist 
    Geohub = require('geohub');
    var gist = :ID;
    Geohub.gist( gist, function( err, data ){
      console.log( data );
    });

    // Extract GeoJSON from a repo 
