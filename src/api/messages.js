({
  create: {
    needToken: true,
    structure: {
      chatId: { mandatory: true, validators: [isNumber] },
      message: {
        mandatory: true,
        validators: [isString, (str) => str.length > 0],
      },
    },
    controller: async ({ chatId, message }, cookie) => {
      const token = cookie.get('token');
      const user = await db('users').select('id').where({ token }).first();
      const data = { chatId, message, userId: user.id };
      const [messages] = await db('messages').insert(data).returning('id');
      const { id } = messages;
      const users = await db('usersChats')
        .select(['token'])
        .join('users', { userId: 'id' })
        .where({ chatId })
        .whereNot({ userId: user.id });
      events.emit('message', message, users, chatId, user.id);
      return { success: true, data: { id, userId: user.id, chatId, message } };
    },
  },
  read: {
    needToken: true,
    structure: {
      chatId: { mandatory: true, validators: [isNumber] },
    },
    fields: ['id', 'message', 'chatId', 'userId', 'createdAt'],
    async controller({ chatId }, cookie) {
      const token = cookie.get('token');
      const user = await db('users').select('id').where({ token }).first();
      const data = await db('messages')
        .select(this.fields)
        .select(db.raw('"userId" = ? as "myMessage"', [user.id]))
        .where({ chatId });
      return { success: true, data };
    },
  },
});
