
exports.up = function(knex) {
    return knex.schema.createTable('samples', t => {
      t.integer('ts')
      t.integer('endpoint_id')
      t.float('value')
  })
};

exports.down = function(knex) {
	return knex.schema.dropTable('samples')
};
