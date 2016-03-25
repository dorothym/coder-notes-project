$(document).ready(function(){

  // Retrieve login information
  $("#loginCE").submit(function( event ) {
    var email = $("#email").val();
    var password = $("#password").val();

    loginCE(email, password)
    event.preventDefault();
  });

  // Save a note
  $("#saveNote").submit(function( event ) {
    var subject = $("#subject").val();
    var notebook = $("#notebook").val();
    var body = $("#body").val();
    var tags = $("#tags").val();
    saveNote(subject, notebook, body, tags);
    event.preventDefault();
  });

  // retrieves the user's notebooks
  chrome.storage.sync.get('currentUser', function(result) {
    var currentUser = result.currentUser;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:1337/api/notebooks/', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState == 4 && xhr.status == 200) {
        var notebooksJSON = JSON.parse(xhr.responseText);

        chrome.storage.sync.set({notebooks: notebooksJSON}, function() {
          for (var i = 0; i < notebooksJSON.length; i++) {
            var notebook = "<option>" + notebooksJSON[i].title + "</option>"
            $(notebook).appendTo("#notebook");
          }
        })

      }
    }
    xhr.send();
  })

  // grab highlighted text from the page
  // set up an event listener that triggers when chrome.extension.sendRequest is fired.
  chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
      // text selection is stored in request.selection
      $('textarea').val( request.selection );
  });

  chrome.tabs.executeScript(null, {code: "chrome.extension.sendRequest({selection: window.getSelection().toString() });"});

});

// Login to the chrome extension
function loginCE(email, password) {
  var params = {
    email: email,
    password: password
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://localhost:1337/login', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Content-length", params.length);
  xhr.setRequestHeader("Connection", "close");

  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);

      chrome.storage.sync.set({currentUser: response.user});

      changePopup('addANote.html')
    }
  }
  xhr.send(JSON.stringify(params));
}

// Change to the correct view
function changePopup(url) {
  window.location.href = url;
  chrome.browserAction.setPopup({
      popup: url
  });
}

// Save a note to notebook
function saveNote(subject, notebook, body, tags) {
  var params = {
    subject: subject,
    notebook: notebook,
    body: body,
    tags: tags
  }

  chrome.storage.sync.get('currentUser', function(result) {
    var currentUser = result.currentUser;

    chrome.storage.sync.get('notebooks', function(result) {
      result = result.notebooks

      var selectedNotebookName = $('#notebook').val();
      var selectedNotebookObj;

      for (var i = 0; i < result.length; i++) {
        if (result[i].title === selectedNotebookName) var selectedNotebookObj = result[i];
      }


      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'http://localhost:1337/api/notebooks/' + selectedNotebookObj._id + '/notes/', true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
          window.location.href = 'noteSaved.html';
        }
      }
      xhr.send(JSON.stringify(params));
    })
  })
}

