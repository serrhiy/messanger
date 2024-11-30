const random = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
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
    avatars: [
      'images/avatars/avatar1.jpg',
      'images/avatars/avatar2.jpg',
      'images/avatars/avatar3.jpg',
      'images/avatars/avatar4.jpg',
    ],
    async controller(body, cookie) {
      const avatar = this.avatars[random(0, this.avatars.length)];
      const { username, password } = body;
      const user = await db('users').where({ username }).first();
      if (user) {
        return { success: false, message: `User ${username} already exists` };
      }
      const hashed = await common.hashPassword(password);
      const token = common.generateToken();
      await db('users').insert({ ...body, password: hashed, token, avatar });
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
    fields: ['password', 'token'],
    async controller({ username, password }, cookie) {
      const { fields } = this;
      const selector = { username };
      const user = await db('users').select(fields).where(selector).first();
      if (!user) return { success: false, message: "User doesn't exist" };
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
    fields: [
      'id',
      'username',
      'firstName',
      'secondName',
      'avatar',
      'lastOnline',
    ],
    async controller(body) {
      const query = db('users').select(this.fields);
      if ('id' in body) {
        const data = await query.where({ id: body.id }).first();
        return { success: true, data };
      }
      for (const [key, value] of Object.entries(body)) {
        if (value) query.orWhereILike(key, `%${value}%`);
      }
      return { success: true, data: await query };
    },
  },

  me: {
    needToken: true,
    structure: {},
    fields: ['id', 'username', 'firstName', 'secondName', 'lastOnline'],
    async controller(body, cookie) {
      const token = cookie.get('token');
      const { fields } = this;
      const user = await db('users').select(fields).where({ token }).first();
      return { success: true, data: user };
    },
  },

  updateOnline: {
    needToken: true,
    structure: {},
    controller: async (body, cookie) => {
      const token = cookie.get('token');
      await db('users').update({ lastOnline: db.fn.now() }).where({ token });
      return { success: true };
    },
  },
});
