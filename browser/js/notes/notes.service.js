app.service('notesService', function(){
	var allnotes = undefined;
	var addAllnotes = function(myNotes){
		allnotes = myNotes;
	} 
	var getAllnotes = function(){
		if(!allnotes) return "";
		else return allnotes;
	}
	return {
		getallnotes: getAllnotes,
		addAllnotes: addAllnotes
	}

})