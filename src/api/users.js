const users = db('users');
const sessions = db('sessions');

const fields = ['username', 'password', 'id'];

const queryByString = (fields, limit = 10) => {
  const tokens = [];
  const values = [];
  let index = 1;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    tokens.push(key + ' ilike $' + index);
    values.push('%' + value + '%');
    index++;
  }
  const condition = tokens.join(' and ') + ' limit ' + limit;
  return { condition, values };
};

({
  create: async (body, cookie) => {
    const hashed = await common.hashPassword(body.password);
    const user = { ...body, password: hashed };
    const newToken = common.generateToken();
    const { id } = await users.create(user);
    await sessions.create({ userId: id, token: newToken });
    cookie.set('token', newToken);
    return { success: true };
  },

  login: async (body, cookie) => {
    const { username, password } = body;
    const clients = await users.read(fields, { username });
    if (!clients.length) return { success: false, message: 'No such user' };
    const [user] = clients;
    const valid = await common.validatePassword(password, user.password);
    if (!valid) return { success: false, message: 'Invalid password' };
    const oldToken = cookie.get('token');
    if (!oldToken) {
      const session = await sessions.read(['token'], { userId: user.id });
      if (session.length !== 0) {
        const { token } = session[0];
        cookie.set('token', token);
        return { success: true };
      }
    }
    const token = await common.generateToken();
    const exists = await sessions.exists({ token: oldToken });
    if (exists) await sessions.update({ token, userId: user.id }, { token });
    else await sessions.create({ token, userId: user.id });
    cookie.set('token', token);
    return { success: true };
  },

  read: async (body) => {
    const { id, username, firstName, secondName } = body;
    if (id) return { success: true };
    const fields = { username, firstName, secondName };
    const { condition, values } = queryByString(fields);
    const sql = `select "username", "firstName", "secondName" from users where ` + condition;
    console.log(await users.query(sql, values));
    return { success: true };
  },
});
