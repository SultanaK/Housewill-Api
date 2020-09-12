'use strict';
const CategoryService = {
    getAllCategory(knexInstance) {
        return knexInstance
            .select('*')
            .from('category')
            .then(category => {
                return category;
            });
    },
     getItemByCategoryId(knexInstance,category_id) {
        return knexInstance
            .from('item')
            .select('*')
            .where('category_id', category_id)
            .first()
        
    }, 
     addCategory(knexInstance, category) {
        return knexInstance
            .insert(category)
            .into('category')
            .returning('*')
            .then(category => {
                return category[0];
            });
    }, 

    getById(knexInstance, id) {
        return knexInstance
            .from('category')
            .select('*')
            .where('id', id)
            .first();
    },
    deleteFolder(knex, id) {
        return knex('category')
            .where('id', id)
            .delete();
    },
    updateFolder(knex, id, updatedCategory) {
        return knex('category')
            .where('id', id)
            .update(updatedCategory)
    }

};
module.exports = CategoryService;