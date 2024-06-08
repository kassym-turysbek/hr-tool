exports.up = function(knex, Promise) {
    return knex.schema.createTable('questions', (table) => {
        table.increments('id').primary();
        table.string('question').notNullable();
        table.string('question_image');
        table.integer('test_id')
            .references('id')
            .inTable('tests')
            .onDelete('CASCADE');
        table.string('correct').notNullable();
        table.string('false_question_one').notNullable();
        table.string('false_question_two').notNullable();
        table.string('false_question_three').notNullable();
        table.string('false_question_four');
        table.string('false_question_five');
        table.string('false_question_six');
        table.string('false_question_seven');
        table.integer('recruiters_id')
            .references('id')
            .inTable('recruiters')
            .onDelete('CASCADE');
        table.timestamps(true, true);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('questions');
};