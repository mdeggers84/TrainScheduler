$(document).ready(function() {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCKakWS0ZFRpQ97RALfcLMN4qma1r5ko6U",
		authDomain: "trainscheduler-143e1.firebaseapp.com",
		databaseURL: "https://trainscheduler-143e1.firebaseio.com",
		storageBucket: "trainscheduler-143e1.appspot.com",
		messagingSenderId: "312673371906"
	};
	firebase.initializeApp(config);
	
	var database = firebase.database();
	var provider = new firebase.auth.GithubAuthProvider();
	var interval = setInterval(updateTable, 60000);

	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});

	function getData(trainData) {
		console.log(trainData);
		var name = trainData.name;
		var dest = trainData.dest;
		var first = trainData.first;
		var freq = trainData.freq;

		var firstConverted = moment(first, "hh:mm").subtract(1, "years");
		var currentTime = moment();
		var diffTime = moment().diff(moment(firstConverted), "minutes");
		var timeRemain = diffTime % freq;
		var minAway = freq - timeRemain;
		var nextTrain = moment().add(minAway, "minutes").format("hh:mm");

		$("#train-schedule > tbody").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" +
			freq + "</td><td>" + nextTrain + "</td><td>" + minAway + "</td>");
	}

	function updateTable() {
		$("#train-schedule > tbody").empty();
		console.log("update");
		database.ref().on("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				getData(childSnapshot.val());
			});
		});
	}

	$("#add-train-btn").on("click", function(event) {
		event.preventDefault();

		var trainName = $("#name-input").val().trim();
		var trainDest = $("#destination-input").val().trim();
		var firstTrain = $("#first-train-input").val().trim();
		var trainFreq = $("#freq-input").val().trim();
		
		var newTrain = {
			name: trainName,
			dest: trainDest,
			first: firstTrain,
			freq: trainFreq
		};

		database.ref().push(newTrain);

		$("#name-input").val("");
		$("#destination-input").val("");
		$("#first-train-input").val("");
		$("#freq-input").val("");

	});

	database.ref().on("child_added", function(childSnapshot, prevChildKey) {

		getData(childSnapshot.val());

	});
});




