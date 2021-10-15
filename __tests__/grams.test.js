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

    it('POSTs a new gram and returns it', () => {
        const newGram = {
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        };
        return request(app)
            .post('/api/grams')
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

    it('gets a gram by id', async () => {
        const newGram = {
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        };
        await request(app).post('/api/grams').send(newGram);
        return request(app)
            .get('/api/grams/1')
            .then((res) => {
                expect(res.body).toEqual({
                    id: '1',
                    ...newGram,
                    comment: 'laaadeeeflippindaaa',
                });
            });
    });

    it('updates the caption on a gram', async () => {
        const entry = await Gram.insert({
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        });
        const updateEntry = {
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'DONT smell my tail',
            tags: ['smelly', 'skunk', 'alan'],
        };

        return request(app)
            .patch(`/api/grams/${entry.id}`)
            .send(updateEntry)
            .then((res) => {
                expect(res.body).toEqual({ id: '2', ...updateEntry });
            });
    });

    it('gets the 10 most popular grams based on comments', async () => {
        const res = request(app).get('/api/grams/popular');
        expect(res.body).toEqual([
            {
                id: '1',
                username: 'gay',
                photoUrl: 'http://jodee.messina/image.png',
                caption: 'ive got a quarter',
                tags: ['heads', 'greyhound', 'carolina'],
            },
            {
                id: '2',
                username: 'queerdo',
                photoUrl: 'http://dolly.parton/image.png',
                caption: 'highlight of my low life',
                tags: ['jolene', 'low life'],
            },
        ]);
    });

    afterAll(() => {
        pool.end();
    });
});
