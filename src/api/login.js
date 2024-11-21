const users = db('users');
const sessions = db('sessions');

const fields = ['username', 'password', 'id'];

({
  create: async (body, cookie) => {
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
});
