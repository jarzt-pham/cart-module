const tableName = 'cart_attributes';

exports.up = async (knex) => {
    const isHasTable = await knex.schema.hasTable(tableName);

    if (isHasTable) return;

    await knex.schema.createTable(tableName, (table) => {
        table.string('code', 32).primary().notNullable();
        table.string('label').notNullable();
        table.string('type', 32).notNullable();
        table.string('status', 32).notNullable();
        table.boolean('visibility').notNullable();
        table.integer('sort_order').notNullable();
        table.boolean('system_defined').notNullable();
        table.boolean('editable').notNullable();
        table.text('options');
        table.dateTime('created_at').notNullable();
        table.dateTime('updated_at');
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists(tableName);
};
