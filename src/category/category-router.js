const express = require('express')
const CategoryService = require('../category-service')
const categorysRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const xss = require('xss')

const serializeCategory = category => ({
    id: category.id,
    category_name: category.category_name,
    
})

categorysRouter
    .route('/')
    .get((req, res, next) => {
        CategoryService.getAllCategory(req.app.get('db'))
            .then(categorys => {
                res.json(categorys.map(serializeCategory))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { categoryr_name} = req.body
        const newCategory = { category_name }
        for (const [key, value] of Object.entries(newCategory)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
        CategoryService.addcategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(serializeCategory(category))
            })
            .catch(next)
    })
categorysRouter
    .route('/:category_id')
    .all((req, res, next) => {
        CategoryService.getById(
            req.app.get('db'),
            req.params.category_id
        )
            .then(category => {
                if (!category) {
                    return res.status(404).json({
                        error: { message: `Category doesn't exist.` }
                    })
                }
                res.category = category // save the article for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })


    .get((req, res, next) => {
        res.json({
            id: res.category.id,
            category_name: xss(res.category.category_name), 
            
        })
    })
    
        
    
    
module.exports = categorysRouter