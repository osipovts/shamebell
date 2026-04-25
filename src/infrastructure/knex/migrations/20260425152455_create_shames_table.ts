import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('shames', (table) => {
    table.increments('id').primary();
    table.string('chat_id', 255).notNullable().unique();
    table.date('latest_shame_date').notNullable();
    table.text('latest_shame_log').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('shames');
}
