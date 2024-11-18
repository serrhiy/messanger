({
  create: async (body) => {
    await db('users').create(body);
  },
});
