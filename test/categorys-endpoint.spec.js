const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeCategorysArray, makeMaliciousCategory, } = require('./categorys.fixtures')

describe('Categorys Endpoints', function () {
    let db
    let testCategorys = makeCategorysArray();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)

    })

    after('disconnect from db', () => db.destroy())


    before('clean the table', () => db.raw('TRUNCATE item,category RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE item,category RESTART IDENTITY CASCADE'))
    
    describe(`GET /api/categorys`, () => {
        context(`Given no categorys`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/categorys')
                    .expect(200, [])
            })
        })


        context('Given there are categorys in the database', () => {
            const testCategorys = makeCategorysArray()
            beforeEach('insert category', () => {
                return db
                    .into('category')
                    .insert(testCategorys)
            })
            it('GET /api/categprys responds with 200 and all of the categorys', () => {
                return supertest(app)
                    .get('/api/categorys')
                    .expect(200, testCategorys)
            })
        })
        context(`Given an XSS attack category`, () => {
            const { maliciousCategory, expectedCategory } = makeMaliciousCategory()

            beforeEach('insert malicious category', () => {
                return db
                    .into('category')
                    .insert([maliciousCategory])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/categorys`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].item_name).to.eql(expectedCategory.item_name)
                        
                    })
            })
        })
        describe(`GET /api/categorys/:category_id`, () => {
            context(`Given no categorys`, () => {
                it(`responds with 404`, () => {
                    const categoryId = 123456
                    return supertest(app)
                        .get(`/api/categoryrs/${categoryId}`)
                        .expect(404, { error: { message: `Category doesn't exist.` } })
                })
            })


            context('Given there are categorys in the database', () => {
                const testCategorys = makeCategorysArray()

                beforeEach('insert categorys', () => {
                    return db
                        .into('category')
                        .insert(testCategorys)
                })

                it('GET /api/categorys/:category_id responds with 200 and the specified item', () => {
                    const categoryId = 2
                    const expectedCategory = testCategorys[categoryId - 1]
                    return supertest(app)
                        .get(`/api/categorys/${categoryId}`)
                        .expect(200, expectedCategory)
                })
            })

        })
    })

    /* describe(`POST /api/categorys`, () => {
        it(`creates item, responding with 201 and the new item`, function () {
            this.retries(3)
            const newCaterory = {
                category_name: 'Test new article',
            }
            return supertest(app)
                .post('/api/categorys')
                .send(newCategory)
                .expect(201)
                .expect(res => {
                    expect(res.body.category_name).to.eql(newCategory.category_name)     
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/categorys/${res.body.id}`)
                  const expected = new Date().toLocaleString('en', { timeZone: 'UTC' })
                    const actual = new Date(res.body.modified).toLocaleString('en', { timeZone: 'UTC' }) 
                    expect(actual).to.eql(expected) 


                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/categorys/${postRes.body.id}`)
                        .expect(postRes.body)
                )


        })
        const requiredFields = ['category_name']

        requiredFields.forEach(field => {
            const newCategory = {
                category_name: 'Test new item',
                
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newCategory[field]

                return supertest(app)
                    .post('/api/categorys')
                    .send(newCategory)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })

    }) */
    
})



