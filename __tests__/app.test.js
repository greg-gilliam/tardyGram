const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');

jest.mock('../lib/middleware/ensureAuth.js', () => {
    return (req, res, next) => {
        req.user = {
            username: 'test_user',
            photoUrl: 'https://example.com/image.png',
            iat: Date.now(),
            exp: Date.now(),
        };

        next();
    };
});


describe('demo routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    afterAll(() => {
        pool.end();
    });

    it('returns a user object when logged in', async () => {
        const res = await request(app).get('/api/auth/verify');

        expect(res.body).toEqual({
            username: 'test_user',
            photoUrl: 'https://example.com/image.png',
            iat: expect.any(Number),
            exp: expect.any(Number),
        });
    });

    it('confirms redirect to github with login', async () => {
        const res = await request(app).get('/api/auth/login');
        expect(res.redirect).toEqual(true);
    });

    xit('tests get /login/callback and makes a new user if non existent', async () => {
        const res = await request(app).get('/api/auth/login/callback');

        expect(res.body).toEqual();
    });

    xit('tests get /login/callback and updates the users avatar_url', async () => {
        const pretending = await User.insert({
            username: 'test_user',
            photoUrl: 'https://example.com/image.png'
        });
        const res = await request(app).get(`/api/auth/${pretending.username}`);

        expect(res.body).toEqual();
    });
});
