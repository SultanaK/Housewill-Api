const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeItemsArray, makeMaliciousItem, makeNewItem, makeUpdatedItem } = require('./items.fixtures')
const { makeCategorysArray } = require('./categorys.fixtures')

describe('Items Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)

    })
    //console.log(process.env.TEST_DB_URL)
    after('disconnect from db', () => db.destroy())
    beforeEach('clean the table', () => db.raw('TRUNCATE itme, category RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE'));


    describe(`GET /api/items`, () => {
        context(`Given no items`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/items')
                    .expect(200, [])
            })
        })


        context('Given there are items in the database', () => {
            const testItems = makeItemsArray()
            const testCategorys = makeCategorysArray()
            beforeEach('insert categorys and items', () => {
                return db
                    .into('category')
                    .insert(testCategorys)
                    .then(() => {
                        return db
                            .into('item')
                            .insert(testItems)
                    })
            })
            it('responds with 200 and the specified item', () => {
                const itemId = 2
                const expectedItem = testItems[ItemId - 1]
                return supertest(app)
                    .get(`/api/items/${itemId}`)
                    .expect(200, expectedItem)
            })

            /* it('GET /api/notes responds with 200 and all of the notes', () => {
                return supertest(app)
                    .get('/api/notes')
                    .expect(200, testNotes)
            }) */
        })
        context(`Given an XSS attack article`, () => {
            const { maliciousItem, expectedItem } = makeMaliciousItem()
            const testItems = makeItmesArray()
            const testCategorys = makeCategorysArray()
            beforeEach('insert malicious item', () => {
                return db
                    .into('category')
                    .insert(testCategorys)
                    .then(() => {
                        return db.into('item').insert([maliciousItem])
                    })
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/items`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].title).to.eql(expectedItem.title)
                        expect(res.body[0].link).to.eql(expectedItem.link)
                        expect(res.body[0].price).to.eql(expectedItem.price)
                        expect(res.body[0].modified).to.eql(expectedItem.modified)
                        expect(res.body[0].Category_id).to.eql(expectedItem.category_id)
                        expect(res.body[0].description).to.eql(expectedItem.description)
                    })
            })
        })
        describe(`GET /api/items/:item_id`, () => {
            context(`Given no items`, () => {
                it(`responds with 404`, () => {
                    const itemId = 123456
                    return supertest(app)
                        .get(`/api/items/${itemId}`)
                        .expect(404, { error: { message: `Item doesn't exist.` } })
                })
            })


            context('Given there are items in the database', () => {
                const testItems = makeItemsArray()
                const testCategorys = makeCategorysArray()
                beforeEach('insert itmes', () => {
                    return db
                        .into('category')
                        .insert(testCatgeorys)
                        .then(() => {
                            return db.into('item').insert(testItems)
                        })
                })

                it('GET /api/items/:item_id responds with 200 and the specified item', () => {
                    const itemId = 2
                    const expectedItem = testItems[itemId - 1]
                    return supertest(app)
                        .get(`/api/items/${itemId}`)
                        .expect(200, expecteditem)
                })
            })

        })
    })

    describe(`POST /api/items`, () => {
        const testCategorys = makeCategorysArray()
        const testItems = makeItemsArray()

        beforeEach('clean the table', () => db.raw('TRUNCATE teim, category RESTART IDENTITY CASCADE'));

        beforeEach('insert categorys and items', () => {
            return db.into('category').insert(testCategorys)
                //.then(() => {
                //    return db.into('note').insert(testNotes)
               // })
        })
        it(`responds with 200 and the created item`, () => {
            
            const testItems = makeNewItem()[0]; //get object from array
            console.log(testItems)
            return supertest(app)
                .post('/api/items')
                .send(testItems)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(tesItems.title)
                    expect(res.body.description).to.eql(testItems.description)
                    expect(res.body.price).to.eql(tesItems.price)
                    expect(res.body.link).to.eql(testItems.link)
                    expect(res.body.category_id).to.eql(testItems.category_id)
                });
        });
        //});

        it(`creates item, responding with 201 and the new item`, function () {
            this.retries(3)
            const newItem = {
                title: 'Test new article',
                link: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
                price: 20,
                modified: ('2019-01-03T00:00:00.000Z'),
                category_id: 1,
                description: 'Test new item description...'
            }
            return supertest(app)
                .post('/api/items')
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newItem.title)
                   // expect(res.body.modified).to.eql(newNote.modified)
                    expect(res.body.category_id).to.eql(newItem.category_id)
                    expect(res.body.description).to.eql(newItem.description)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`)
                    const expected = new Intl.DateTimeFormat('en-US').format(new Date())
                    const actual = new Intl.DateTimeFormat('en-US').format(new Date(res.body.modified))
                    expect(actual).to.eql(expected)


                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/items/${postRes.body.id}`)
                        .expect(postRes.body)
                )


        })
        const requiredFields = ['title','link','price', 'category_id', 'description']

        requiredFields.forEach(field => {
            const newItem = {
                title: 'Test new note',
                link: 'CodingTheSmartWay.com',
                price:20,
                modified: '2019-01 - 03T00: 00: 00.000Z',
                category_id: 1,
                desdription: 'Test new item description...'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newItem[field]

                return supertest(app)
                    .post('/api/items')
                    .send(newItem)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })
})
describe(`DELETE /api/items/:item_id`, () => {
    const testItems = makeItemsArray()
    const testCategorys = makeCategorysArray()
    
    context(`Given no items`, () => {
        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DB_URL,
            })
            app.set('db', db)

        })  
        beforeEach('clean the table', () => db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE'));
        beforeEach('insert categorys and items', () => {
            return db
                .into('category')
                .insert(testCategorys)
                 .then(() => {
                    return db
                        .into('item')
                        .insert(testItems)
                }) 
        })
        it(`responds with 404`, () => {
            const itemId = 123456
            return supertest(app)
                .delete(`/api/items/${itemId}`)
                .expect(404, { error: { message: `Item doesn't exist.` } })
        })
    })

    context('Given there are items in the database', () => {
        const testItems = makeItemsArray()
        const testCategorys=makeItemsArray()
        
        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DB_URL,
            })
            app.set('db', db)

        }) 
      
        it('responds with 204 and removes the item', () => {
            beforeEach('clean the table', () => db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE'));
            beforeEach('insert categorys and items', () => {
                return db
                    .into('category')
                    .insert(testCategorys)
                    .then(() => {
                        return db
                            .into('item')
                            .insert(testItems)
                    })
            })
            const testItems = makeItemsArray()
            const testCategorys = makeItemsArray()
            
            const idToRemove = 2
            const expectedItems = testItems.filter(item => item.id !== idToRemove)
            return supertest(app)
                .delete(`/api/items/${idToRemove}`)
                .expect(204)
                .then(() =>
                    supertest(app)
                        .get(`/api/items`)
                        .expect(expectedItems)
                )
        })
    })

})
    /* describe(`PATCH /api/notes`, () => {
context(`Given no notes in the database`, () => {
    it(`responds with 400 error when non-existent note is patched`, () => {
        const fakeNoteId = 8696886;

        return supertest(app)
            .patch(`/api/notes/${fakeNoteId}`)
            .expect(404);
    });
});

context(`Given notes in the database`, () => {
    const testFolders = makeFoldersArray();
    const testNotes = makeNotesArray();

    beforeEach('insert folders and notes', () => {
        return db.into('folders')
            .insert(testFolders)
            .then(() => {
                return db
                    .into('notes')
                    .insert(testNotes)
            });
    });

    it(`responds with 400 error when wrong field is sent`, () => {
        const fakeNote = makeFakeNote()[0]; //extract note for object

        return supertest(app)
            .patch(`/api/notes/${fakeNote.note_id}`)
            .send(fakeNote)
            .expect(400);
    });

    it(`responds with 200 message when note is updated succesfully`, () => {
        const updatedNote = makeUpdatedNote()[0];

        return supertest(app)
            .patch(`/api/notes/${updatedNote.note_id}`)
            .send(updatedNote)
            .expect(204)
            .then(() => {
                supertest(app)
                    .get(`/api/notes/${updatedNote.note_id}`)
                    .expect(201)
                    .expect(res => { //test case when all fields were updated
                        expect(res.body.note_name).to.eql(testNote.note_name)
                        expect(res.body.content).to.eql(testNote.content)
                        expect(res.body.folder_id).to.eql(testNote.folder_id)
                    })
            });
    });
});
}); */





