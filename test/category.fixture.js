function makeCategorysArray() {
	return [
		{
			id: 1,
			category_name: 'First test post!',
		},
		{
			id: 2,
			category_name: 'second test post!',
		},
		{
			id: 3,
			category_name: 'third test post!',
		},
		{
			id: 4,
			category_name: 'forth test post!',
		},
	];
}
function makeMaliciousCategory() {
	const maliciousCategory = {
		id: 911,
		category_name: 'How-to',
	};
	const expectedCategory = {
		...maliciousCategory,
		category_name: 'How-to',
	};
	return {
		maliciousCategory,
		expectedCategory,
	};
}

module.exports = {
	makeCategorysArray,
	makeMaliciousCategory,
};
