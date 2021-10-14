const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

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

// function () {
//   return function (req, res, next) {
//     req.user = ...
//   }
// }

// jest.mock('../lib/data/users.js', () => {
//   return [{ user_id: 4 }, { user_id: 5 }, { user_id: 6 }];
// });

describe.skip('demo routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    afterAll(() => {
        pool.end();
    });

    it('returns a user object from GET /api/auth/me when logged in', async () => {
        const res = await request(app).get('/api/auth/me');

        expect(res.body).toEqual({
            username: 'test_user',
            photoUrl: 'https://example.com/image.png',
            iat: expect.any(Number),
            exp: expect.any(Number),
        });
    });

    // it('requires a logged in user to GET /api/auth/me', async () => {
    //   const res = await request(app).get('/api/auth/me');

    //   expect(res.body).toEqual({
    //     status: 401,
    //     message: 'You must be signed in to continue.',
    //   });
    // });
});
