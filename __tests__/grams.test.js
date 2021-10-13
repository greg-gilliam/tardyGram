const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');
const Gram = require('../lib/models/Gram.js');

jest.mock('../lib/middleware/ensureAuth.js', () => {
    return (req, res, next) => {
        req.user = {
            username: 'skunky',
            avatarUrl: 'http://alan.greg/1.png',
            iat: Date.now(),
            exp: Date.now(),
        };

        next();
    };
});

describe('gram routes', () => {
    beforeEach(async () => {
        await setup(pool);
        return User.insert({
            username: 'skunky',
            avatarUrl: 'http://alan.greg/1.png',
        });
    });

    it('POSTs a new gram and returns it', () => {
        const newGram = {
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        };
        return request(app)
            .post('/api/auth/grams')
            .send(newGram)
            .then((res) => {
                //console.log('RES.body', res.body);
                expect(res.body).toEqual({
                    id: '1',
                    ...newGram,
                });
            });
    });

    it('returns all grams', async () => {
        const newGram = {
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        };
        await Gram.insert(newGram);
        return request(app)
            .get('/api/grams')
            .then((res) => {
                expect(res.body).toEqual([
                    {
                        id: '1',
                        username: 'skunky',
                        photoUrl: 'http://gram.greg/1.png',
                        caption: 'smell my tail',
                        tags: ['smelly', 'skunk', 'alan'],
                    },
                ]);
            });
    });

    it('deletes a gram by id', async () => {
        return request(app)
            .delete('/api/grams/1')
            .then((res) => {
                expect(res.body).toEqual({});
            });
    });

    afterAll(() => {
        pool.end();
    });
});
