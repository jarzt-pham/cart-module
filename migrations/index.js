const createTableCartItems = require('./tables/20221021045431_create_cart_items_table');
const createTableCarts = require('./tables/20221021045428_create_carts_table');
const createTableCartAttributes = require('./tables/20221021050239_create_cart_attributes_table');
const createTableCartAttributeValues = require('./tables/20221021050247_create_cart_attribute_values_table');

exports.upAll = async (knex) => {
    await createTableCarts.up(knex);
    await createTableCartItems.up(knex);
    await createTableCartAttributes.up(knex);
    await createTableCartAttributeValues.up(knex);
};
exports.downAll = async (knex) => {
    await createTableCartAttributeValues.down(knex);
    await createTableCartAttributes.down(knex);
    await createTableCartItems.down(knex);
    await createTableCarts.down(knex);
};

