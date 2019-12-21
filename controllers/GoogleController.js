/**
 * Google Identity Controller
 * @author: Ananay Arora <i@ananayarora.com>
 */

const { google } = require('googleapis');
const OAuth2Data = require('../client_secret.json');

// Credentials and configuration
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

// Google OAuth2 Client object
const client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly'
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
 * @param {string} code - Authorization Code 
 * @return {Promise<string>} accessToken – Access Token
 */
let callbackHandler = (code) => {
    return new Promise((resolve, reject) => {
        client.getToken(code, (err, tokens) => {
            if (err) {
                console.error("Error authenticating: " + code);
                console.error(err);
                reject(false);
            } else {
                console.log("Successful Login!");
                client.setCredentials(tokens);
                resolve(true);
            }
        });
    });
}

/**
 * Grabs the email using the Gmail API
 * @return {string} email – The email address
 */
let getEmail = () => {
    const gmail = google.gmail({ version: 'v1', auth: client });
    return new Promise((resolve, reject) => {
        gmail.users.getProfile({
            userId: 'me'
        }, (err, res) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(res.data.emailAddress);
        });
    });
}

module.exports = {
    getLoginUrl,
    callbackHandler,
    getEmail
}