const tableName = 'carts';

exports.up = async (knex) => {
    const tableExists = await knex.schema.hasTable(tableName);
    if (!tableExists) {
        return knex.schema.createTable(tableName, (table) => {
            table.uuid('id').primary();
            table.uuid('user_id').notNullable();
            table.uuid('creator_id');
            table.boolean('enabled').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at');
            table.uuid('target_id');
        });
    }
};

exports.down = async (knex) => {
    return knex.schema.dropTableIfExists(tableName);
};
