const User = require('../models/User');
const { exchangeCodeForToken, getUserProfile } = require('../utils/githubApi');

module.exports = class UserService {
    static async create(code) {
        // exchange the code from GitHub for an access_token
        const accessToken = await exchangeCodeForToken(code);

        //use accessToken to request GitHub user's profile

        const profileBody = await getUserProfile(accessToken);

        //create a user record with the GitHub user's username & profile image

        let user = await User.findByUsername(profileBody.login);

        if (!user) {
            user = await User.insert({
                username: profileBody.login,
                avatarUrl: profileBody.avatar_url,
            });
        }

        return user;
    }
};
