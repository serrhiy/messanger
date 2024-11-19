const users = db('users');
const sessions = db('sessions');

({
  create: async (body, cookie) => {
    const token = cookie.get('token');
    if (token) {
      const exists = await sessions.exists({ token });
      if (exists) {
        return { success: false, message: 'User has active token' };
      }
    }
    const hashed = common.hash(body.password);
    const user = { ...body, password: hashed };
    const newToken = common.generateToken();
    const { id } = await users.create(user);
    await sessions.create({ userId: id, token: newToken });
    cookie.set('token', newToken);
    return { success: true };
  },
});
