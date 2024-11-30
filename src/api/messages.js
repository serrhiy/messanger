({
  create: {
    needToken: true,
    structure: {
      userId: { mandatory: true, validators: [isNumber] },
      chatId: { mandatory: true, validators: [isNumber] },
      message: {
        mandatory: true,
        validators: [isString, (str) => str.length > 0],
      },
    },
    controller: async ({ userId, chatId, message }) => {
      const { id } = await db('messages').insert({ userId, chatId, message });
      const users = await db('usersChats')
        .select(['token'])
        .join('users', { userId: 'id' })
        .where({ chatId })
        .whereNot({ userId });
      events.emit('message', message, users, chatId, userId);
      return { success: true, data: { id, userId, chatId, message } };
    },
  },
  read: {
    needToken: true,
    structure: {
      chatId: { mandatory: true, validators: [isNumber] },
    },
    fields: ['id', 'message', 'chatId', 'userId', 'createdAt'],
    async controller({ chatId }) {
      const data = await db('messages').select(this.fields, { chatId });
      return { success: true, data };
    },
  },
});
