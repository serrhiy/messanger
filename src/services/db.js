'use strict';

const pg = require('pg');

const pool = new pg.Pool({
  user: 'trajan',
  database: 'messanger',
  password: '1111',
  port: 5432,
  host: '127.0.0.1',
});

module.exports = (table) => ({
  query: async(sql, args) => await pool.query(sql, args),

  create: async (data) => {
    const names = Object.keys(data);
    const values = Object.values(data);
    const numbers = new Array(names.length);
    for (let i = 0; i < names.length; i++) numbers[i] = '$' + (i + 1);
    const fields = '"' + names.join('", "') + '"';
    const indices = numbers.join(',');
    const sql = `insert into "${table}" (${fields}) values (${indices})`;
    return await pool.query(sql, values);
  },

  read: async (id, fields) => {
    const names = fields.map((field) => `"${field}"`).join(',');
    if (!id) return await pool.query(`select ${names} from "${table}"`);
    const sql = `select ${names} from "{${table}" where id = $1`;
    return await pool.query(sql, [id]);
  },

  update: async (id, record) => {
    const keys = Object.keys(record);
    const updates = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      updates[i] = `${key} = $${++i}`;
    }
    const delta = updates.join(', ');
    const sql = `update "${table}" set ${delta} where id = $${++i}`;
    data.push(id);
    return pool.query(sql, data);
  },

  delete: async ({ ...selectors }) => {
    const args = [];
    const values = [];
    let index = 1;
    for (const key in selectors) {
      values.push(selectors[key]);
      const arg = '"' + key + '"=$' + index++;
      args.push(arg);
    }
    const fields = '"' + args.join('", and "') + '"';;
    const sql = `delete from "${table}" where ${fields}`;
    return await pool.query(sql, values);
  },
});
