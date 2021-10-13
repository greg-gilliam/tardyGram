const fetch = require('cross-fetch');

const exchangeCodeForToken = async (oauthCode) => {
    // takes code and exchanges it for access_token
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: oauthCode,
        }),
    });

    const tokenBody = await res.json();
    // returns a token
    return tokenBody.access_token;
};

const getUserProfile = async (token) => {
    const res = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `token ${token}`,
        },
    });

    const profileBody = await res.json();

    return profileBody;
};

module.exports = { exchangeCodeForToken, getUserProfile };
