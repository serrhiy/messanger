
const messages = db('messages');

({
  create: {
    needToken: true,
    structure: {
      userId: { mandatory: true, validators: [isNumber] },
      chatId: { mandatory: true, validators: [isNumber] },
      message: {
        mandatory: true, 
        validators: [isString, (str) => str.length > 0]
      }
    },
    controller: async ({ userId, chatId, message }) => {
      const { id } = await messages.create({ userId, chatId, message });
      return { success: true, data: { id, userId, chatId, message } };
    },
  },
});
