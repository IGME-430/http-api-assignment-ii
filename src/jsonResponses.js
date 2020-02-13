const query = require('querystring');

const users = {};

const messages = {
  200: {
    id: 'getUsers',
    message: 'This is a getUsersful response',
  },
  201: {
    id: 'create',
    message: 'Created Successfully',
  },
  204: {
    id: 'updated',
    message: '',
  },
  400: {
    id: 'badRequest',
    message: 'Name and age are both required',
  },
  404: {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  },
  501: {
    id: 'notImplemented',
    message: 'A get request for this page has not been implemented yet.  Check again later for updated content.',
  },
};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addUser = (request, response) => {
  const res = response;
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    const responseJSON = {
      message: 'Name and age are both required.',
    };

    if (!bodyParams.name || !bodyParams.age) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    if (users[bodyParams.name]) {
      responseCode = 204;
    } else {
      users[bodyParams.name] = {};
    }

    users[bodyParams.name].name = bodyParams.name;
    users[bodyParams.name].age = bodyParams.age;

    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
  });
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200, messages[200]);
};

const create = (request, response) => {
  respondJSON(request, response, 201, messages[201]);
};

const createMeta = (request, response) => {
  respondJSONMeta(request, response, 201, messages[201]);
};

const updated = (request, response) => {
  respondJSON(request, response, 204, messages[204]);
};

const updatedMeta = (request, response) => {
  respondJSONMeta(request, response, 204, messages[204]);
};

const badRequest = (request, response, parsedUrl) => {
  let returnValue;

  if (!parsedUrl.properties.valid || parsedUrl.properties.valid !== 'true') {
    returnValue = respondJSON(request, response, 400, messages[400]);
  } else {
    returnValue = respondJSON(request, response, 200, messages[200]);
  }

  return returnValue;
};

const badRequestMeta = (request, response) => {
  respondJSONMeta(request, response, 400, messages[400]);
};

const notFound = (request, response) => {
  respondJSON(request, response, 404, messages[404]);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404, messages[404]);
};

module.exports = {
  addUser,
  getUsers,
  getUsersMeta,
  create,
  createMeta,
  badRequest,
  badRequestMeta,
  updated,
  updatedMeta,
  notFound,
  notFoundMeta,
};
