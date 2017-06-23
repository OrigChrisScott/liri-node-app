var key = require('./keys.js');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var action = process.argv[2];
var media = "";


function twitterCall() {
// Shows last 20 tweets with creation dates

	// Fetches Twitter API keys from separate keys.js file
	var client = new twitter({
		consumer_key: key.twitterKeys['consumer_key'],
		consumer_secret: key.twitterKeys['consumer_secret'],
		access_token_key: key.twitterKeys['access_token_key'],
		access_token_secret: key.twitterKeys['access_token_secret']
	});

	// Query parameters for Twitter API
	var params = {screen_name: '@SirCutvid', count: 20};

	// API call.  Error first, then iterate through tweets array to pull posts
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (error) {
			return console.log("Something went wrong.");
		} else {
			for (i = 0; i < tweets.length; i++) {
				console.log("\nPosted on: " + tweets[i].created_at);
				console.log("\tTweet: " + tweets[i].text);
			}
			console.log("\n");
		}
	});
}

function spotifyCall(songString) {
// Accepts input (Song Name)
// Shows Artist(s), Song Name, Preview Link from Spotify, Album Name

	// Fetches Spotify API keys from separate keys.js file
	var client = new spotify({
		id: key.spotifyKeys['client_id'],
		secret: key.spotifyKeys['client_secret']
	});

	// Query parameters for Spotify API
	// Default song: "I saw the sign" by Ace of Base
	const defaultSong = 'I saw the sign';
	const defaultArtist = 'Ace of Base';

	if (songString === '') {
		songString = defaultArtist + "&" + defaultSong;
	}

	// *** BUG HANDLING - Need to write:
	// How to search for both track and artist at once (Node package limitation? API limitation?).
	// Multi-dimensional searches giving unpredictable results.
	var params = {type: 'track', query: songString};

	// API call.  Error first, then pull object properties
	client.search(params, function(error, data){
		if (error) {
			return console.log("Something went wrong with spotifyCall function. Error: " + error);
		} else {
			// *** BUG HANDLING - Need to write:
			// Provisions for multiple matching songs, multiple artists.
			// Use inquirer npm package to display options to user and allow user to select
			// correct song from list of API call results.
			console.log("\nArtist(s): " + data.tracks.items[0].artists[0].name);
			console.log("Title: " + data.tracks.items[0].name);
			// Check to see if "preview_url" property exists
			if (data.tracks.items[0].preview_url) {
				console.log("Preview URL: " + data.tracks.items[0].preview_url);
			} else {
				console.log("Preview URL:\tnone provided");
			}
			console.log("Album: " + data.tracks.items[0].album.name + "\n");
		}
	});
}

function omdbCall(movie) {
// Accepts input (Movie Name)
// Shows (Title, Year, IMDB Rating, Country, Language, Plot, Actors, Rotten Tomatoes URL)

	// Query parameters for OMDB API
	// Default movie: "Mr. Nobody"
	const defaultMovie = 'Mr. Nobody';

	if (movie === '') {
		movie = defaultMovie;
	}

 	var omdbKey = key.omdbKey; 
	var client = new request('http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + movie + '&y=&plot=short&r=json', function(error, response, body) {
		
		if (error) {
			console.log("Something went wrong with omdbCall function. Error: " + error);
		} else {
			// Parse JSON contents from body of API call
			var contents = JSON.parse(body);
			// Output information
			console.log("\nTitle: " + contents.Title);
			console.log("Year: " + contents.Year);
			console.log("Rotten Tomatoes Score: " + contents.Ratings[1].Value + "\n");
			console.log("IMDB Rating: " + contents.Rated);
			console.log("Country: " + contents.Country);
			console.log("Language: " + contents.Language);
			console.log("Plot: " + contents.Plot);
			console.log("Actors: " + contents.Actors);
		}
	});
}

function doWhatItSays() {
// Retrieves text inside random.txt file and uses it to call another LIRI command (my-tweets, spotify-this-song, movie-this)

	const fileName = 'random.txt';
	fs.readFile(fileName, 'UTF8', function(error, data){

		if (error) {
			console.log("Something went wrong, " + fileName + " not read.");
		} else {
			// Create array from data content string in [fileName]
			var dataArr = data.split(',');			
			// Check to see if there is(are) one argument or two in [fileName]
			if (dataArr.length < 2) {
				// Remove newline character (\n) at end of last argument
				action = dataArr[0].substring(0, dataArr[0].length - 1);
			} else {
				action = dataArr[0];
				// Remove newline character (\n) at end of last argument
				media = dataArr[1].substring(0, dataArr[1].length - 1);
			}

			// Evaluate action call from [fileName], run appropriate function
			switch(action) {
				case 'my-tweets':
					twitterCall();
					break;	
				case 'spotify-this-song':
					spotifyCall(media);
					break;
				case 'movie-this':
					omdbCall(media);
					break;
				default:
					console.log("Invalid entry in " + fileName + ". Please check and try again.");
					break;
			}			
		}

	});

}

// Takes action argument passed from command line in process.argv[2]
// Run appropriate function
switch(action) {
	case 'my-tweets':
		twitterCall();
		break;	
	case 'spotify-this-song':
		// Data handling for multiple words passed without quotes
		for (i = 3; i < process.argv.length; i++) {
			media += (process.argv[i] + " ");
		}	
		spotifyCall(media);
		break;
	case 'movie-this':
		// Data handling for multiple words passed without quotes
		for (i = 3; i < process.argv.length; i++) {
			media += (process.argv[i] + " ");
		}
		omdbCall(media);
		break;
	case 'do-what-it-says':
		doWhatItSays();
		break;
	default:
		console.log("Sorry, that is an invalid action.  Please enter a valid action after \"liri.js\".");
		break;
}
