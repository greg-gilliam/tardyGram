const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('demo routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('POSTs a new gram and returns it', () => {
        //auth
        const newGram = {
            username: 'skunky',
            photoUrl: 'http://alan.greg/1.png',
            caption: 'smell my tail',
            tags: ['smelly', 'skunk', 'alan']
        };
        return request(app) 
            .post('/api/auth/grams')
            .send(newGram)
            .then((res) => {
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
