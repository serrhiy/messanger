const messages = db('messages');

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
      const { id } = await messages.create({ userId, chatId, message });
      const sql = `
        select users.token from "usersChats" 
        join users on "userId"=id 
        where "chatId"=$1 and "userId"!=$2
      `;
      const participants = await messages.query(sql, [chatId, userId]);
      events.emit('message', message, participants, chatId, userId);
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
      const data = await messages.read(this.fields, { chatId });
      return { success: true, data };
    },
  },
});
