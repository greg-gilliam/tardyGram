const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');

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
    beforeEach(async() => {
        await setup(pool);
        return User.insert({
            username: 'skunky', 
            avatarUrl: 'http://alan.greg/1.png'
        });
    });

    it('POSTs a new gram and returns it', () => {
        const newGram = {
            username: 'skunky',
            photoUrl: 'http://gram.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan']
        };
        return request(app) 
            .post('/api/auth/grams')
            .send(newGram)
            .then((res) => {
                //console.log('RES.body', res.body);
                expect(res.body).toEqual({
                    id: '1',
                    ...newGram
                
                });
            });
    });
    afterAll(() => {
        pool.end();
    });
});
