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
    /* addItem(knexInstance, item, user_id) { */
    addItem(knexInstance, item ) {
        return knexInstance
            .insert(item)
            .into('item')
            /* .where('user_id',user_id) */
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
    /* deleteItem(knexInstance, id, user_id) { */
    deleteItem(knexInstance, id) {
        return knexInstance('item')
            .where({ id })
            /* .where('user_id', user_id) */
            .delete();
    },
    /* updateItem(knexInstance, id, user_id, newItemFields) { */
    updateItem(knexInstance, id, newItemFields) {
        return knexInstance('item')
            .where({ id })
            /* .where({ user_id }) */
            .update(newItemFields);
        
    }
   
}

module.exports = ItemsService
