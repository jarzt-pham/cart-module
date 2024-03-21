const tableName = 'cart_items';

exports.up = async (knex) => {
    const tableExists = await knex.schema.hasTable(tableName);
    if (!tableExists) {
        return knex.schema.createTable(tableName, (table) => {
            table.uuid('id').primary();
            table.uuid('cart_id').notNullable().references('id').inTable('carts').onDelete('CASCADE');
            table.uuid('product_id').notNullable();
            table.integer('qty').defaultTo(1).unsigned().notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at');
            table.unique(['cart_id', 'product_id']);
            table.uuid('stock_id');
            table.bigInteger('custom_price');
        });
    }
};

exports.down = async (knex) => {
    return knex.schema.dropTableIfExists(tableName);
};
