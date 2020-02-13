const parseJSON = (xhr, content) => {
  // parse response (obj will be empty in a 204 updated)
  try {
    const obj = JSON.parse(xhr.response);
    console.dir(obj);

    // if message in response, add to screen
    if (obj.message) {
      const p = document.createElement('p');
      p.textContent = `Message: ${obj.message}`;
      content.appendChild(p);
    }

    // if users in response, add to screen
    if (obj.users) {
      const userList = document.createElement('p');
      const users = JSON.stringify(obj.users);
      userList.textContent = users;
      content.appendChild(userList);
    }
  } catch (e) {
    return false;
  }
};

const handleResponse = (xhr) => {
  const content = document.querySelector('#content');

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

const sendPost = (e, nameForm) => {
  e.preventDefault();

  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  const nameField = nameForm.querySelector('#nameField');
  const ageField = nameForm.querySelector('#ageField');

  const xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr);

  const formData = `name=${nameField.value}&age=${ageField.value}`;

  xhr.send(formData);

  return false;
};

const sendAjax = (e) => {
  e.preventDefault();

  const url = document.querySelector('#urlField').value;
  const method = document.querySelector('#methodSelect').value;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr, true);

  xhr.send();

  return false;
};

const init = () => {

  // connect to forms
  const nameForm = document.querySelector('#nameForm');
  const userForm = document.querySelector('#userForm');

  // create handlers to forms
  const addUser = (e) => sendPost(e, nameForm);
  const getUser = (e) => sendAjax(e);

  // attach submit event (for clicking submit or hitting enter)
  nameForm.addEventListener('submit', addUser);
  userForm.addEventListener('submit', getUser);
};

window.onload = init;
