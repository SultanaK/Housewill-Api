'use strict'
const ItemsService = {
    getAllItem(knexInstance) {
        return knexInstance
            .select('*')
            .from('item')
            .then(item => {
                return item;
            });
    },
    addItem(knexInstance, item) {
        return knexInstance
            .insert(item)
            .into('item')
            .returning('*')
            .then(item => {
                return item[0];
            });
    },

    getItemById(knexInstance, id) {
        return knexInstance
            .from('item')
            .select('*')
            .where('id', id)
            .first();
    },
    getItemByName(knexInstance, searchTerm) {
        return knexInstance
            .from('item')
            .select('*')
            .where('title', 'ILIKE', `%${searchTerm}%`)
            
        
    },
    deleteItem(knexInstance, id) {
        return knexInstance('item')
            .where({ id })
            .delete();
    },
    updateItem(knexInstance, id, newItemFields) {
        return knexInstance('item')
            .where({ id })
            .update(newItemFields);
        
    }
   
}

module.exports = ItemsService
