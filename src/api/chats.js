const chats = db('chats');
const usersChats = db('usersChats');

const isString = (value) => typeof value === 'string';

const isNumber = (value) => !Number.isNaN(Number.parseInt(value));

({
  create: {
    needToken: true,
    structure: {
      name: {
        mandatory: false,
        validators: [isString, (str) => str.length >= 1]
      },
      users: {
        mandatory: true,
        validators: [
          Array.isArray,
          (users) => users.length >= 2,
          (users) => users.every(isNumber)
        ]
      },
      avatar: { mandatory: false, validators: [isString] },
    },
    controller: async ({ name, avatar, users }) => {
      const isDialog = users.length === 2 ? true : false;
      const { id, createdAt } = await chats.create({ name, avatar, isDialog });
      const promises = users.map((userId) => (
        usersChats.create({ chatId: id, userId })
      ));
      await Promise.all(promises);
      return { success: true, data: { id, createdAt, name, avatar } };
    },
  },

  read: {
    needToken: true,
    structure: {
      userId: { mandatory: true, validators: [isNumber] },
    },
    controller: async ({ userId }) => {
      const fields = ['id', 'name', 'avatar', 'isDialog', 'createdAt']
        .map((field) => `"${field}"`).join(',');
      const sql = `select ${fields} from "usersChats" join "chats" on "chatId" = "id" where "userId" = $1`;
      const data = await chats.query(sql, [userId]);
      return { success: true, data }
    },
  },

  participants: {
    needToken: true,
    structure: {
      id: { mandatory: true, validators: [isNumber] },
    },
    controller: async ({ id }) => {
      const fields = ['id', 'username', 'firstName', 'secondName', 'avatar']
        .map((field) => `"${field}"`).join(',');
      const sql = `select ${fields} from "usersChats" join "users" on "userId" = id where "chatId" = $1`;
      const data = await chats.query(sql, [id]);
      return { success: true, data };
    },
  }
});
