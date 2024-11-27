const users = db('users');

const queryByString = (fields, limit = 10) => {
  const tokens = [];
  const values = [];
  let index = 1;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    tokens.push('"' + key + '" ilike $' + index);
    values.push('%' + value + '%');
    index++;
  }
  const condition = tokens.join(' or ') + ' limit ' + limit;
  return { condition, values };
};

({
  create: {
    needToken: false,
    structure: {
      username: {
        mandatory: true,
        validators: [isString, (str) => str.length >= 3],
      },
      firstName: {
        mandatory: true,
        validators: [isString, (str) => str.length >= 2],
      },
      secondName: {
        mandatory: true,
        validators: [isString, (str) => str.length >= 2],
      },
      password: {
        mandatory: true,
        validators: [isString, (str) => str.length >= 4],
      },
    },
    controller: async (body, cookie) => {
      const { username, password } = body;
      const exists = await users.exists({ username });
      if (exists) {
        return { success: false, message: `User ${username} already exists` };
      }
      const hashed = await common.hashPassword(password);
      const token = common.generateToken();
      await users.create({ ...body, password: hashed, token });
      cookie.set('token', token);
      return { success: true };
    },
  },

  login: {
    needToken: false,
    structure: {
      username: {
        mandatory: true,
        validators: [isString, (str) => str.length >= 3],
      },
      password: {
        mandatory: true,
        validators: [isString, (str) => str.length >= 4],
      },
    },
    controller: async ({ username, password }, cookie) => {
      const persons = await users.read(['password', 'token'], { username });
      if (persons.length === 0) {
        return { success: false, message: "User doesn't exist" };
      }
      const user = persons[0];
      const valid = await common.validatePassword(password, user.password);
      if (!valid) return { success: false, message: 'Invalid password' };
      cookie.set('token', user.token);
      return { success: true };
    },
  },

  read: {
    needToken: true,
    structure: {
      username: { mandatory: false, validators: [isString] },
      firstName: { mandatory: false, validators: [isString] },
      secondName: { mandatory: false, validators: [isString] },
      id: { mandatory: false, validators: [isNumber] },
    },
    controller: async (body) => {
      const fields = ['id', 'username', 'firstName', 'secondName', 'avatar'];
      const { username, firstName, secondName, id } = body;
      if (id) {
        const user = await users.read(fields, { id });
        return { success: true, data: user };
      }
      const selectors = { username, firstName, secondName };
      const { condition, values } = queryByString(selectors);
      const fieldsStr = fields.map((field) => `"${field}"`).join(',');
      const sql = `select ${fieldsStr} from "users" where ` + condition;
      const persons = await users.query(sql, values);
      return { success: true, data: persons };
    },
  },

  me: {
    needToken: true,
    structure: {},
    fields: ['id', 'username', 'firstName', 'secondName', 'lastOnline'],
    async controller(body, cookie) {
      const token = cookie.get('token');
      const [user] = await users.read(this.fields, { token });
      return { success: true, data: user };
    },
  },

  updateOnline: {
    needToken: true,
    structure: {},
    controller: async (body, cookie) => {
      const token = cookie.get('token');
      const sql = `
        update users 
        set "lastOnline" = current_timestamp 
        where token = $1
      `;
      await users.query(sql, [token]);
      return { success: true };
    }
  }
});
