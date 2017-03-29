$(document).ready(function() {
	var provider = new firebase.auth.GithubAuthProvider();

	firebase.auth().signInWithRedirect(provider);
});