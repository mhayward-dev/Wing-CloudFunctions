const jwt = require('jsonwebtoken');

// Set in `environment` of serverless.yml
const AUTH0_WEB_CLIENT_ID = process.env.AUTH0_WEB_CLIENT_ID;
const API_URL = process.env.API_URL;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.webAuth = (event, context, callback) => {
  console.log('event', event);

  const options = {
    audience: AUTH0_WEB_CLIENT_ID,
  };

  verifyJwt(options, event, callback);
};

module.exports.machineAuth = (event, context, callback) => {
  console.log('event', event);

  const options = {
    audience: API_URL,
  };

  verifyJwt(options, event, callback);
};

function verifyJwt(options, event, callback) {
  if (!event.authorizationToken) {
    return false;
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!doesTokenExist(tokenParts, tokenValue)) {
    callback('Unauthorized');
  }

  try {
    jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
      if (verifyError) {
        console.log('verifyError', verifyError);
        // 401 Unauthorized
        console.log(`Token invalid. ${verifyError}`);
        return callback('Unauthorized');
      }
      // is custom authorizer function
      console.log('valid from customAuthorizer', decoded);
      return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
    });
  } catch (err) {
    console.log('catch error. Invalid token', err);
    return callback('Unauthorized');
  }
}

function doesTokenExist(tokenParts, tokenValue) {
  return (tokenParts[0].toLowerCase() === 'bearer' && tokenValue);
}