const axios = require('axios');
const qs = require('querystring');
const express = require('express');
const router = express.Router();

const clientId = 'example-app';
const clientSecret = 'ZXhhbXBsZS1hcHAtc2VjcmV0';
const scope = 'openid email profile federated:id';
const authBaseUrl = 'http://localhost:5556/dex';
const callbackUrl = 'http://localhost:3000/callback';
const state = 'abc123';

const createLoginUrl = (redirectUri, state) => {
  return authBaseUrl + '/auth'
    + '?client_id=' + clientId
    + '&scope=' + encodeURIComponent(scope)
    + '&redirect_uri=' + redirectUri
    + '&state=' + state
    + '&response_type=code'
    ;
};

const createAccessTokenUrl = (code, state) => {
  return authBaseUrl + '/token'
    ;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  const loginUrl = createLoginUrl(callbackUrl, state);
  res.redirect(loginUrl);
});

router.get('/callback', function(req, res, next) {
  console.log(req.query);
  const code = req.query.code;
  if (code) {
    // Verify the code
    const tokenUrl = createAccessTokenUrl(code, state);
    const data = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      code: code,
      state: state
    };
    console.log(tokenUrl);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    axios.post(tokenUrl, qs.stringify(data), config).then(result => {
      res.send(result.data);
    }).catch(err => {
      console.log(err);
      res.send(err.message);
    });
  }
});

module.exports = router;
