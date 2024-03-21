const TABLE_NAME = 'cart_attribute_values';

exports.up = async (knex) => {
    const isHasTable = await knex.schema.hasTable(TABLE_NAME);

    if (isHasTable) return;

    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid('id').primary();
        table.text('value').notNullable();
        table.uuid('entity_id').references('id').inTable('carts').notNullable();
        table.string('attribute_code', 32).references('code').inTable('cart_attributes').notNullable();
        table.dateTime('created_at').notNullable();
        table.dateTime('updated_at');
        table.unique(['entity_id', 'attribute_code']);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists(TABLE_NAME);
};
