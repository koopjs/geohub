geohub 
====

Simple GeoJSON extractor from Github repos and Gists

## Install

    npm install geohub

## Usage 

    // Extract GeoJSON from a gist 
    Geohub = require('geohub');
    var gist = 6021269;

    // send the id 
    Geohub.gist( { id: gist, token: '(optional) github_api_token', function( err, data ){
      console.log( data );
    });

    // Extract GeoJSON from a repo 
    var user = 'chelm', 
      repo = 'grunt-geo'
      path = 'forks';

    Geohub.repo( user, repo, path, function( err, data ){
      console.log( data );
    });

    // You can also return all geojson in repo 
    Geohub.repo( user, repo, null, function( err, data ){
      console.log( data.length );
      // logs out: 3 
    });

## Tests 

    grunt vows

## Notes

  * Was going to the use the node-github module but ran into some issues with accessing content with it  
