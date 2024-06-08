exports.up = function(knex, Promise) {
    return knex.schema.createTable('questionsBelbin', (table) => {
        table.increments('id').primary();
        table.string('questionBelbin').notNullable();
        table.integer('test_id')
            .references('id')
            .inTable('tests')
            .onDelete('CASCADE');
        table.string('optionA').notNullable();
        table.string('optionB').notNullable();
        table.string('optionC').notNullable();
        table.string('optionD').notNullable();
        table.string('optionE').notNullable();
        table.string('optionF').notNullable();
        table.string('optionG').notNullable();
        table.string('optionH').notNullable();
        table.string('optionI').notNullable();
        table.integer('recruiters_id')
            .references('id')
            .inTable('recruiters')
            .onDelete('CASCADE');
        table.timestamps(true, true);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('questionsBelbin');
};