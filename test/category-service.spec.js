const categoryService = require('../src/category-service')
const knex = require('knex')
const { makeCategorysArray } = require('./categorys.fixtures')


describe(`Categorys service object`, function () {
    let db
    const testCategory = makeCategorysArray()
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })
    after(() => db.destroy())
    beforeEach(() => db.raw('TRUNCATE item,category RESTART IDENTITY CASCADE'))
        
    afterEach('cleanup', () => db.raw('TRUNCATE item,category RESTART IDENTITY CASCADE'))
   

    context(`Given 'category' has data`, () => {
        beforeEach(() => {
            return db
                .into('category')
                .insert(testCategory)
        })
        it(`resolves all Category from 'category' table`, () => {
            // test that ArticlesService.getAllArticles gets data from table
            return categoryService.getAllCategory(db)
                .then(actual => {
                    expect(actual).to.eql(testCategory)
                })

        })
        it(`getcategoryById() resolves an category by id from 'category' table`, () => {
            const thirdId = 3
            const thirdTestcategory = testCategory[thirdId - 1]
            return categoryService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        category_name: thirdTestcategory.category_name,

                    })
                })
        })


    })




    context(`Given 'category' has no data`, () => {
        it(`getAllCategory() resolves an empty array`, () => {
            return categoryService.getAllCategory(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    })
    it(`insertcategory() inserts a new category and resolves the new item with an 'id'`, () => {
        const newcategory = {
            id: 4,
            category_name: 'forth test post!',
        }
        return categoryService.addCategory(db, newcategory)
            .then(actual => {
                expect(actual).to.eql({
                    id: 4,
                    category_name: newcategory.category_name,


                })
            })


    })

})


