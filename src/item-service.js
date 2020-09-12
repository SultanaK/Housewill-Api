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
            .where('item_id', id)
            .first();
    },

    deleteItem(knexInstance, item_id) {
        return knexInstance('item')
            .where({ item_id })
            .delete();
    },
    updateItem(knexInstance, id, newItemFields) {
        return knexInstance('item')
            .where({ id })
            .update(newItemFields);
        
    }
   
}

module.exports = ItemsService
