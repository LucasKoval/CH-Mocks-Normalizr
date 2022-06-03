//----------* REQUIRE'S *----------//
const FileSystemContainer = require('../Classes/FileSystemContainer')
const messagesDB = new FileSystemContainer('messages')

//----------* MESSAGES CONTROLLER *----------//
const messagesController = {
  getAllMessages: async () => {
    try {
      const allMessages = await messagesDB.getAll()
      return allMessages
    } catch (error) {
      console.log(error)
    }
  },

  addNewMessage: async (message) => {
    try {
      const prevMessages = await messagesDB.getAll()
      const currentDate = new Date().toLocaleString()

      const getNewId = () => {
        let lastID = 0
        if (prevMessages.length) {
          lastID = prevMessages[prevMessages.length - 1].id
        }
        return lastID + 1
      }

      const newMessage = {
        id: getNewId(),
        email: message.email ? message.email : 'user@email.com',
        date: currentDate,
        messageText: message.messageText ? message.messageText : '(Empty message)',
      }

      await messagesDB.addItem(newMessage)
    } catch (error) {
      console.log(error)
    }
  },
}

//----------* EXPORTS CONTROLLER *----------//
module.exports = messagesController
