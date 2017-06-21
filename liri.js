var key = require('./keys.js');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var action = process.argv[2];
var media;


function twitterCall() {
// Shows last 20 tweets with creation dates
	console.log("twitterCall called");

	console.log(key.twitterKeys);
	var client = new twitter({
		consumer_key: key.twitterKeys['consumer_key'],
		consumer_secret: key.twitterKeys['consumer_secret'],
		access_token_key: key.twitterKeys['access_token_key'],
		access_token_secret: key.twitterKeys['access_token_secret']
	});

	var params = {count: '20'};

	client.get('statuses/update', params, function(error, tweets, response){
		if (!error) {
			console.log(tweets);
			console.log(response);
		} else {
			console.log("Sorry, something went wrong.");
		}
	});
}

function spotifyCall(song) {
// Accepts input (Song Name)
// Shows (Artist(s), Song Name, Preview Link from Spotify, Album Name - Default value: "The Sign" by Ace of Base)
	console.log("spotifyCall called");
}

function omdbCall(movie) {
// Accepts input (Movie Name)
// Shows (Title, Year, IMDB Rating, Country, Language, Plot, Actors, Rotten Tomatoes URL - Default value: "Mr. Nobody")
	console.log("omdbCall called");
}

function doWhatItSays() {
// Retrieves text inside random.txt file and uses it to call another LIRI command (my-tweets, spotify-this-song, movie-this)
	console.log("doWhatItSays called");
}

switch(action) {
	case 'my-tweets':
		twitterCall();
		break;	
	case 'spotify-this-song':
		spotifyCall();
		break;
	case 'movie-this':
		omdbCall();
		break;
	case 'do-what-it-says':
		doWhatItSays();
		break;
}
