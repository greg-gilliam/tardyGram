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
        await User.insert({
            username: 'skunky',
            avatarUrl: 'http://alan.greg/1.png',
        });
        return Gram.insert({
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        });
    });

    it('POSTs a new comment and returns it', () => {
        const newComment = {
            commentBy: 'skunky',
            gram: '1',
            comment: 'ewwwwww',
        };
        return request(app)
            .post('/api/comments')
            .send(newComment)
            .then((res) => {
                expect(res.body).toEqual({
                    id: '4',
                    ...newComment,
                });
            });
    });

    it('DELETEs a comment by id', async () => {
        const newComment = {
            commentBy: 'skunky',
            gram: '1',
            comment: 'ewwwwww',
        };
        await request(app).post('/api/comments').send(newComment);
        return request(app)
            .delete('/api/comments/1')
            .then((res) => {
                expect(res.body).toEqual({});
            });
    });

    afterAll(() => {
        pool.end();
    });
});
