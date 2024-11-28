const chats = db('chats');
const usersChats = db('usersChats');
const users = db('users');

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
    controller: async ({ name, avatar, users: persons }, cookie) => {
      const token = cookie.get('token');
      const fields = ['id', 'username', 'firstName', 'secondName', 'avatar', 'lastOnline'];
      const [user] = await users.read(fields, { token });
      const isDialog = persons.length === 2 ? true : false;
      const { id, createdAt } = await chats.create({ name, avatar, isDialog });
      const promises = persons.map((userId) =>
        usersChats.create({ chatId: id, userId }),
      );
      await Promise.all(promises);
      const data = { id, createdAt, name, avatar, isDialog };
      const sql = `
        select token, username from "usersChats"
        join users on "userId" = id
        where "chatId" = $1 and "userId" != $2
      `;
      if (isDialog) data.user = user;
      const participants = await users.query(sql, [id, user.id]);
      events.emit('chat', participants, data);
      return { success: true, data };
    },
  },

  read: {
    needToken: true,
    structure: {
      userId: { mandatory: true, validators: [isNumber] },
    },
    fields: ['id', 'name', 'avatar', 'isDialog', 'createdAt', 'lastTimeInChat']
      .map((field) => `"${field}"`)
      .join(','),
    async controller({ userId }) {
      const sql = `
        select ${this.fields} from "usersChats"
        join chats on "chatId" = id 
        where "userId" = $1
      `;
      const data = await chats.query(sql, [userId]);
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
    ]
      .map((field) => `"${field}"`)
      .join(','),
    async controller({ id }) {
      const sql = `
        select ${this.fields} from "usersChats" 
        join "users" on "userId" = id 
        where "chatId" = $1
      `;
      const data = await chats.query(sql, [id]);
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
      const [user] = await users.read(['id'], { token });
      const { id: userId } = user;
      const sql = `
        update "usersChats"
        set "lastTimeInChat" = current_timestamp
        where "userId" = $1 and "chatId" = $2
      `;
      await users.query(sql, [userId, chatId]);
      return { success: true };
    },
  },
});
