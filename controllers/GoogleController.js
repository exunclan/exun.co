/**
 * Google Identity Controller
 * @author: Ananay Arora <i@ananayarora.com>
 */

const {OAuth2Client} = require('google-auth-library');
const OAuth2Data = require('../client_secret.json');
const jwt = require('jsonwebtoken')

// Credentials and configuration
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
let REDIRECT_URL = "";
if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "dev") {
    REDIRECT_URL = OAuth2Data.web.redirect_uris[1];
} else {
    REDIRECT_URL = OAuth2Data.web.redirect_uris[0];
}

// Google OAuth2 Client object
const client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
];

/**
 * Generates the login URL for the shortener
 * @return {string} url - The login url
 */
let getLoginUrl = () => {
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    })
}

/**
 * Handles the callback:
 * - Checks the authorization code
 * - Generates the access token
 * - Gets the profile from the jwt token
 * @param {string} code - Authorization Code 
 * @return {Promise<string>} accessToken – Access Token
 */
let callbackHandlerAndGetProfile = (code) => {
    return new Promise((resolve, reject) => {
        client.getToken(code, (err, tokens) => {
            console.log(tokens);
            // console.log(tokens);
            if (err) {
                console.error("Error authenticating: " + code);
                console.error(err);
                reject(false);
            } else {
                client.setCredentials(tokens);
                resolve(jwt.decode(tokens.id_token));
            }
        });
    });
}

module.exports = {
    getLoginUrl,
    callbackHandlerAndGetProfile
}