const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {
	makeItemsArray,
	makeMaliciousItem,
	makeNewItem,
	makeUpdatedItem,
} = require('./items.fixtures');
const { makeCategorysArray } = require('./category.fixture');

describe('Items Endpoints', function() {
	let db;

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL,
		});
		app.set('db', db);
	});
	
	after('disconnect from db', () => db.destroy());
	beforeEach('clean the table', () =>
		db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE')
	);
	afterEach('cleanup', () =>
		db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE')
	);

	describe(`GET /api/items`, () => {
		context(`Given no items`, () => {
			it(`responds with 200 and an empty list`, () => {
				return supertest(app).get('/api/items').expect(200, []);
			});
		});

		context('Given there are articles in the database', () => {
			const testItems = makeItemsArray();
			const testCategorys = makeCategorysArray();
			beforeEach('insert categorys and items', () => {
				return db.into('category').insert(testCategorys).then(() => {
					return db.into('item').insert(testItems);
				});
			});
			it('responds with 200 and the specified article', () => {
				const itemId = 2;
				const expectedItem = testItems[itemId - 1];
				return supertest(app)
					.get(`/api/items/${itemId}`)
					.expect(200, expectedItem);
			});

			it('GET /api/items responds with 200 and all of the items', () => {
				return supertest(app).get('/api/items').expect(200, testItems);
			});
		});
		context(`Given an XSS attack article`, () => {
			const { maliciousItem, expectedItem } = makeMaliciousItem();
			const testItems = makeItemsArray();
			const testCategorys = makeCategorysArray();
			beforeEach('insert malicious item', () => {
				return db.into('category').insert(testCategorys).then(() => {
					return db.into('item').insert([ maliciousItem ]);
				});
			});

			it('removes XSS attack content', () => {
				return supertest(app).get(`/api/items`).expect(200).expect((res) => {
					expect(res.body[0].title).to.eql(expectedItem.title);
					expect(res.body[0].link).to.eql(expectedItem.link);
					expect(res.body[0].price).to.eql(expectedItem.price);
					expect(res.body[0].email).to.eql(expectedItem.email);
					expect(res.body[0].modified).to.eql(expectedItem.modified);
					expect(res.body[0].category_id).to.eql(expectedItem.category_id);
					expect(res.body[0].description).to.eql(expectedItem.description);
				});
			});
		});
		describe(`GET /api/items/:item_id`, () => {
			context(`Given no items`, () => {
				it(`responds with 404`, () => {
					const itemId = 123456;
					return supertest(app)
						.get(`/api/items/${itemId}`)
						.expect(404, { error: { message: `Item doesn't exist` } });
				});
			});

			context('Given there are items in the database', () => {
				const testItems = makeItemsArray();
				const testCategorys = makeCategorysArray();
				beforeEach('insert items', () => {
					return db.into('category').insert(testCategorys).then(() => {
						return db.into('item').insert(testItems);
					});
				});

				it('GET /api/Items/:item_id responds with 200 and the specified item', () => {
					const itemId = 2;
					const expectedItem = testItems[itemId - 1];
					return supertest(app)
						.get(`/api/items/${itemId}`)
						.expect(200, expectedItem);
				});
			});
		});
	});

	describe(`POST /api/items`, () => {
		const testCategorys = makeCategorysArray();
		const testItems = makeItemsArray();

		beforeEach('clean the table', () =>
			db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE')
		);

		beforeEach('insert categorys and items', () => {
			return db.into('category').insert(testCategorys);
			
		});
		it(`responds with 200 and the created item`, () => {
			const testItems = makeNewItem()[0]; 
			console.log(testItems);
			return supertest(app)
				.post('/api/items')
				.send(testItems)
				.expect(201)
				.expect((res) => {
					expect(res.body.title).to.eql(testItems.title);
					expect(res.body.category_id).to.eql(testItems.category_id);

					expect(res.body.description).to.eql(testItems.description);

					expect(res.body.link).to.eql(testItems.link);
					expect(res.body.price).to.eql(testItems.price);
					expect(res.body.email).to.eql(testItems.email);
				});
		});
		//});

		it(`creates item, responding with 201 and the new item`, function() {
			this.retries(3);
			const newItem = {
				title: 'Test new article',
				link: 'www.Test-new-article.com',
				category_id: 2,
				price: '10.00',
				description: 'Test new item',
				email: 'test@email.com',
			};
			return supertest(app)
				.post('/api/items')
				.send(newItem)
				.expect(201)
				.expect((res) => {
					expect(res.body.title).to.eql(newItem.title);
					// expect(res.body.modified).to.eql(newNote.modified)
					expect(res.body.category_id).to.eql(newItem.category_id);
					expect(res.body.description).to.eql(newItem.description);
					expect(res.body.email).to.eql(newItem.email);
					expect(res.body.price).to.eql(newItem.price);
					expect(res.body.link).to.eql(newItem.link);

					const expected = new Intl.DateTimeFormat('en-US').format(new Date());
					const actual = new Intl.DateTimeFormat('en-US').format(
						new Date(res.body.modified)
					);
					expect(actual).to.eql(expected);
				})
				.then((postRes) =>
					supertest(app)
						.get(`/api/items/${postRes.body.id}`)
						.expect(postRes.body)
				);
		});
		const requiredFields = [
			'title',
			'category_id',
			'link',
			'price',
			'email',
			'description',
		];

		requiredFields.forEach((field) => {
			const newItem = {
				title: 'Test new note',
				category_id: 1,
				description: 'Test new note content...',
				price: '3',
				link: 'Test-link',
				email: 'email@email.com',
				modified: '2019-01 - 03T00: 00: 00.000Z',
			};

			it(`responds with 400 and an error message when the '${field}' is missing`, () => {
				delete newItem[field];

				return supertest(app).post('/api/items').send(newItem).expect(400, {
					error: { message: `Missing '${field}' in request body` },
				});
			});
		});
	});
});
describe(`DELETE /api/items/:item_id`, () => {
	const testItems = makeItemsArray();
	const testCategorys = makeCategorysArray();

	context(`Given no items`, () => {
		before('make knex instance', () => {
			db = knex({
				client: 'pg',
				connection: process.env.TEST_DATABASE_URL,
			});
			app.set('db', db);
		});
		beforeEach('clean the table', () =>
			db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE')
		);
		beforeEach('insert categorys and items', () => {
			return db.into('category').insert(testCategorys).then(() => {
				return db.into('item').insert(testItems);
			});
		});
		it(`responds with 404`, () => {
			const itemId = 123456;
			return supertest(app)
				.delete(`/api/items/${itemId}`)
				.expect(404, { error: { message: `Item doesn't exist` } });
		});
	});

	context('Given there are items in the database', () => {
		const testItems = makeItemsArray();
		const testCategorys = makeItemsArray();

		before('make knex instance', () => {
			db = knex({
				client: 'pg',
				connection: process.env.TEST_DATABASE_URL,
			});
			app.set('db', db);
		});
		/*  beforeEach('clean the table', () => db.raw('TRUNCATE note, folder RESTART IDENTITY CASCADE'));
        beforeEach('insert folders and notes', () => {
            return db
                .into('folder')
                .insert(testFolders)
                .then(() => {
                    return db
                        .into('note')
                        .insert(testNotes)
                })
        }) */
		it('responds with 204 and removes the item', () => {
			beforeEach('clean the table', () =>
				db.raw('TRUNCATE item, category RESTART IDENTITY CASCADE')
			);
			beforeEach('insert categorys and items', () => {
				return db.into('category').insert(testCategorys).then(() => {
					return db.into('item').insert(testItems);
				});
			});
			const testItems = makeItemsArray();
			const testCategorys = makeCategorysArray();

			const idToRemove = 2;
			const expectedItems = testItems.filter((item) => item.id !== idToRemove);
			return supertest(app)
				.delete(`/api/items/${idToRemove}`)
				.expect(204)
				.then(() => supertest(app).get(`/api/items`).expect(expectedItems));
		});
	});
});
