"use strict";

var parseJSON = function parseJSON(xhr, content) {
  // parse response (obj will be empty in a 204 updated)
  try {
    var obj = JSON.parse(xhr.response);
    console.dir(obj); // if message in response, add to screen

    if (obj.message) {
      var p = document.createElement('p');
      p.textContent = "Message: ".concat(obj.message);
      content.appendChild(p);
    } // if users in response, add to screen


    if (obj.users) {
      var userList = document.createElement('p');
      var users = JSON.stringify(obj.users);
      userList.textContent = users;
      content.appendChild(userList);
    }
  } catch (e) {
    return false;
  }
};

var handleResponse = function handleResponse(xhr) {
  var content = document.querySelector('#content');

  switch (xhr.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;

    case 201:
      content.innerHTML = '<b>Create</b>';
      break;

    case 204:
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;

    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      break;

    case 404:
      content.innerHTML = '<b>Resource Not Found</b>';
      break;

    default:
      content.innerHTML = 'Error code not implemented by client.';
      break;
  }

  parseJSON(xhr, content);
};

var sendPost = function sendPost(e, nameForm) {
  e.preventDefault();
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');
  var nameField = nameForm.querySelector('#nameField');
  var ageField = nameForm.querySelector('#ageField');
  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "name=".concat(nameField.value, "&age=").concat(ageField.value);
  xhr.send(formData);
  return false;
};

var sendAjax = function sendAjax(e) {
  e.preventDefault();
  var url = document.querySelector('#urlField').value;
  var method = document.querySelector('#methodSelect').value;
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  xhr.send();
  return false;
};

var init = function init() {
  // connect to forms
  var nameForm = document.querySelector('#nameForm');
  var userForm = document.querySelector('#userForm'); // create handlers to forms

  var addUser = function addUser(e) {
    return sendPost(e, nameForm);
  };

  var getUser = function getUser(e) {
    return sendAjax(e);
  }; // attach submit event (for clicking submit or hitting enter)


  nameForm.addEventListener('submit', addUser);
  userForm.addEventListener('submit', getUser);
};

window.onload = init;
