({
  create: {
    needToken: true,
    structure: {
      name: {
        mandatory: false,
        validators: [isString, (str) => str.length >= 1],
      },
      users: {
        mandatory: true,
        validators: [
          Array.isArray,
          (users) => users.length >= 2,
          (users) => users.every(isNumber),
        ],
      },
      avatar: { mandatory: false, validators: [isString] },
    },
    fields: [
      'id',
      'username',
      'firstName',
      'secondName',
      'avatar',
      'lastOnline',
    ],
    async controller({ name, avatar, users: persons }, cookie) {
      const token = cookie.get('token');
      const { fields } = this;
      const user = await db('users').select(fields).where({ token }).first();
      const isDialog = persons.length === 2 ? true : false;
      const [chat] = await db('chats')
        .insert({ name, avatar, isDialog })
        .returning(['id', 'createdAt']);
      const { id, createdAt } = chat;
      const promises = persons.map((userId) =>
        db('usersChats').insert({ chatId: id, userId }),
      );
      await Promise.all(promises);
      const data = { id, createdAt, name, avatar, isDialog };
      const users = await db('usersChats')
        .select(['token', 'username'])
        .join('users', { userId: 'id' })
        .where({ chatId: id })
        .whereNot({ userId: user.id });
      if (isDialog) data.user = user;
      events.emit('chat', users, data);
      return { success: true, data };
    },
  },

  read: {
    needToken: true,
    structure: {
      userId: { mandatory: true, validators: [isNumber] },
    },
    fields: ['id', 'name', 'avatar', 'isDialog', 'createdAt', 'lastTimeInChat'],
    async controller({ userId }) {
      const data = await db('usersChats')
        .select(this.fields)
        .join('chats', { chatId: 'id' })
        .where({ userId });
      return { success: true, data };
    },
  },

  participants: {
    needToken: true,
    structure: {
      id: { mandatory: true, validators: [isNumber] },
    },
    fields: [
      'id',
      'username',
      'firstName',
      'secondName',
      'avatar',
      'lastOnline',
    ],
    async controller({ id }) {
      const data = await db('usersChats')
        .join('users', { userId: 'id' })
        .where({ chatId: id });
      return { success: true, data };
    },
  },

  updateOnline: {
    needToken: true,
    structure: {
      chatId: { mandatory: true, validators: [isNumber] },
    },
    controller: async ({ chatId }, cookie) => {
      const token = cookie.get('token');
      const { id } = await db('users').select(['id']).where({ token }).first();
      await db('usersChats')
        .update({ lastTimeInChat: db.fn.now() })
        .where({ userId: id, chatId });
      return { success: true };
    },
  },
});
