const express = require('express')
const ItemService = require('../item-service')
const itemsRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const xss = require('xss')

const serializeItem = item => ({
    id: item.id,
    title: xss(item.title),
    link: item.link,
    modified: item.modified,
    price: item.price,
    category_id: item.category_id,
    description: xss(item.description),
})

itemsRouter
    .route('/')
    .get((req, res, next) => {
        ItemService.getAllItem(req.app.get('db'))
            .then(items => {
                res.json(items.map(serializeItem))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, link, price, category_id, description } = req.body
        const newItem = { title, link, price, category_id, description }
        for (const [key, value] of Object.entries(newItem)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
        ItemService.addItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${item.item_id}`))
                    .json(serializeItem(item))
            })
            .catch(next)
    })
itemsRouter
    .route('/search')
    .all((req, res, next) => {
        const { search } = req.query
        ItemService.getItemByName(
            req.app.get('db'),
            search
        )
            .then(item => {
                if (!item) {
                    return res.status(404).json({
                        error: { message: `Item doesn't exist.` }
                    })
                }
                res.item = item
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.item)

    })
itemsRouter
    .route('/:item_id')
    .all((req, res, next) => {
        ItemService.getItemById(
            req.app.get('db'),
            req.params.item_id
        )
            .then(item => {
                if (!item) {
                    return res.status(404).json({
                        error: { message: `Item doesn't exist.` }
                    })
                }
                res.item = item
                next()
            })
            .catch(next)
    })
    
    .get((req, res, next) => {
        res.json(serializeItem(res.item))

    })

    .delete((req, res, next) => {
        ItemService.deleteItem(
            req.app.get('db'),
            req.params.item_id,


        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)

    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const updateItemId = res.item.item_id;
        const { title, link, price, category_id, description, } = req.body;
        const updatedItem = { title, link, price, category_id, description };

        //check that at least one field is getting updated in order to patch
        const numberOfValues = Object.values(updatedItem).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either 'title','link','price','content', or 'category_id'` }
            });
        }

        updatedItem.date_modified = new Date();

        ItemsService.updateItem(knexInstance, updateItemId, updatedItem)
            .then(() => res.status(204).end())
            .catch(next);
    });

module.exports = itemsRouter