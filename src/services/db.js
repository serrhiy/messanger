'use strict';

const pg = require('pg');

const pool = new pg.Pool({
  user: 'trajan',
  database: 'messanger',
  password: '1111',
  port: 5432,
  host: '127.0.0.1',
});

const enumerate = (array, start = 0) => ({
  [Symbol.iterator]: () => ({
    index: start,
    arraysIndex: 0,
    next() {
      return {
        done: this.arraysIndex >= array.length,
        value: [this.index++, array[this.arraysIndex++]],
      };
    },
  }),
});

module.exports = (table) => ({
  query: async (sql, args) => (await pool.query(sql, args)).rows,

  create: async (data) => {
    const names = Object.keys(data);
    const values = Object.values(data);
    const numbers = new Array(names.length);
    for (let i = 0; i < names.length; i++) numbers[i] = '$' + (i + 1);
    const fields = '"' + names.join('","') + '"';
    const indices = numbers.join(',');
    const sql = `insert into "${table}" (${fields}) values (${indices}) returning *`;
    const { rows } = await pool.query(sql, values);
    return rows[0];
  },

  read: async (fields, condition) => {
    const fieldsNames = '"' + fields.join('","') + '"';
    const conditions = [];
    for (const [index, key] of enumerate(Object.keys(condition), 1)) {
      const expression = `"${key}"=$${index}`;
      conditions.push(expression);
    }
    const strCondition = conditions.join(' and ');
    const sql = `select ${fieldsNames} from "${table}" where ${strCondition}`;
    const { rows } = await pool.query(sql, Object.values(condition));
    return rows;
  },

  update: async (selectors, record) => {
    const values = [];
    const conditions = [];
    for (const [index, key] of enumerate(Object.keys(record), 1)) {
      const value = `"${key}"=$${index}`;
      values.push(value);
    }
    const iterator = enumerate(Object.keys(selectors), values.length + 1);
    for (const [index, key] of iterator) {
      const expression = `"${key}"=$${index}`;
      conditions.push(expression);
    }
    const condition = conditions.join(' and ');
    const strValues = values.join(',');
    const data = [...Object.values(record), ...Object.values(condition)];
    const sql = `update "${table}" set (${strValues}) where ${condition}`;
    return pool.query(sql, data);
  },

  delete: async (selectors) => {
    const conditions = [];
    for (const [index, key] of enumerate(Object.keys(selectors), 1)) {
      const condition = `"${key}"=$${index}`;
      conditions.push(condition);
    }
    const condition = conditions.join(' and ');
    const data = Object.values(selectors);
    const sql = `delete from "${table}" where ${condition}`;
    return await pool.query(sql, data);
  },

  exists: async (selectors) => {
    const conditions = [];
    for (const [index, key] of enumerate(Object.keys(selectors), 1)) {
      const condition = `"${key}"=$${index}`;
      conditions.push(condition);
    }
    const condition = conditions.join(' and ');
    const sql = `select exists (select 1 from "${table}" where ${condition})`;
    const { rows } = await pool.query(sql, Object.values(selectors));
    return rows[0].exists;
  },
});
