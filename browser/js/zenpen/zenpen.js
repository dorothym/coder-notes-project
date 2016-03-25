app.config(function ($stateProvider) {

	// this is the main state to show user content.
	$stateProvider.state('zenpen', {
		url: '/zenpen',
		templateUrl: 'js/zenpen/zenpen.html',
	})
});