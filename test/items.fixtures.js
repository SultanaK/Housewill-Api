function makeItemsArray() {
    return [
        {
            id: 1,
            title: 'First test post!',
            link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
            price: '20.00',
            email: 'abc@email.com',
            modified: '2019-01-03T00:00:00.000Z',
            category_id: 1,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
            id: 2,
            title: 'second test post!',
            link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
            price: '20.00',
            email: 'abc@email.com',
            modified: '2019-03-03T00:00:00.000Z',
            category_id: 1,
            description: 'Lorem ipsum dolor sit amet, elit.'
        },
        {
            id: 3,
            title: 'third test post!',
            link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
            price: '20.00',
            email: 'abc@email.com',
            modified: '2019-03-03T00:00:00.000Z',
            category_id: 3,
            description: 'Lorem ipsum dolor sit amet, adipisicing elit.'
        },
        {
            id: 4,
            title: 'forth test post!',
            link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
            price: '20.00',
            email: 'abc@email.com',
            modified: '2019-02-03T00:00:00.000Z',
            category_id: 3,
            description: 'Lorem ipsum dolor sit amet forth, adipisicing elit.'
        }, 
   ] 
}
function makeNewItem() {
    return [
        {
            title: 'New Test Item 3',
            link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
            price: '20.00',
            email: 'abc@email.com',
            category_id: 1,
            content: 'New Test Item 3 Content',
            description:'test'
        }
    ]
}

function makeUpdatedItem() {
    return [
        {
            item_id: 1,
            title: 'Updated Test Item 3',
            link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
            price: '20.00',
            email: 'abc@email.com',
            category_id: 2,
            description: 'Updated Test Item 3 Content',
        }
    ]
}

function makeMaliciousItem() {
    const maliciousItem = {
        id: 911,
        title: 'How-to',
        link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
        price: '20.00',
        email: 'abc@email.com',
        modified: '2019-02-03T00:00:00.000Z',
        category_id: 2,
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.` 
    }
    const expectedItem= {
        ...maliciousItem,
        title: 'How-to',
        link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1734&q=80',
        price: '20.00',
        email: 'abc@email.com',
        modified: '2019-02-03T00:00:00.000Z',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousItem,
        expectedItem,
    }
}

module.exports = {
    makeItemsArray,
    makeNewItem,
    makeUpdatedItem,
    makeMaliciousItem,
}