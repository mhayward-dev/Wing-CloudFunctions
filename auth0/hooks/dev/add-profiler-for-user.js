/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
module.exports = function(user, context, cb) {
  const clientSecret = context.webtask.secrets.apiClientSecret;
  var axios = require('axios').default;

  var authOptions = {
    method: 'POST',
    url: 'https://dev-kg5-6f-1.eu.auth0.com/oauth/token',
    data: {
      grant_type: 'client_credentials',
      client_id: '9VoEM1IOfsI5Wh80hNj2ghVuJWJlZ47U',
      client_secret: clientSecret,
      audience:
        'https://h0bcqs9rmd.execute-api.eu-west-2.amazonaws.com/dev/api',
    },
  };

  axios
    .request(authOptions)
    .then(function(response) {
      console.log(response.data);

      var tokenOptions = {
        method: 'POST',
        url:
          'https://h0bcqs9rmd.execute-api.eu-west-2.amazonaws.com/dev/api/profile/add',
        headers: { authorization: 'Bearer ' + response.data.access_token },
        data: user,
      };

      axios.request(tokenOptions).then(function(result) {
        console.log(result.status);
      });
    })
    .catch(function(error) {
      console.error(error);
    });

  cb();
};
