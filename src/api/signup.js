const users = db('users');
const sessions = db('sessions');

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
});
