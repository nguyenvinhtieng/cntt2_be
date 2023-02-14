const multiparty = require("multiparty");
const QuestionModel = require("../models/Question");
const Question = require("../models/Question");
const uploadFile = require("../../utils/uploadFile");
const uploadImage = require("../../utils/uploadImage");
const Answer = require("../models/Answer");
const AnswerVote = require("../models/AnswerVote");
const User = require("../models/User");
const ChatThread = require("../models/ChatThread");
const Chat = require("../models/Chat");

class ChatController {
  async createThread(req, res) {
    const user = req.user
    try {
      // vinhtieng: 63913c43cab494542f6d02b5
      // user44: 63913c43cab494542f6d033a
      // let user = {_id: "63913c43cab494542f6d02b5" }
      let { user_id } = req.body;
      // user_id = "63913c43cab494542f6d033a"
      let thread = await ChatThread.findOne({
        users: { $all: [user._id, user_id] }
      });

      if(thread) {
        return res.json({status: false, message: "Thread đã tồn tại"});
      }

      let threadNew = new ChatThread({
        users: [user._id, user_id]
      });

      await threadNew.save();
      res.json({status: true, message:"Tạo thread thành công", data: threadNew});
      
    }catch(err) {
      res.status(500).json({status: false, message: err.message});
    }
  }
  async getChatOfThread(req, res) {
    const user = req.user
    try {
      let { chat_thread_id, skip } = req.body;
      skip = skip || 0;
      let LIMIT = 30;
      let chats = await Chat.find({
        chat_thread_id: chat_thread_id
      }).populate("sender").sort({createdAt: -1}).skip(parseInt(skip));
      let chatThread = await ChatThread.findOne({ _id: chat_thread_id }).populate("last_message")
      if(chatThread.new && chatThread.last_message.sender !== user._id) {
        chatThread.new = false;
        await chatThread.save();
      }
      res.json({status: true, message: "Lấy chat thành công", data: chats});
    }catch(err) {
      res.status(500).json({status: false, message: err.message});
    }
  }
  async getChatWithUser(req, res) {
    const user = req.user
    try {
      let { user_slug, skip } = req.body;
      // profileSlug
      const userChatWith = await User.findOne({profileSlug: user_slug});
      if(!userChatWith) {
        return res.json({status: false, message: "Không tìm thấy user"});
      }
      let thread = await ChatThread.findOne({
        users: { $all: [user._id, userChatWith._id] }
      }).populate("users").populate("last_message").lean();

      if(!thread) {
        return res.json({status: true, message: "Không tìm thấy thread", data: [], user: userChatWith});
      }

      skip = skip || 0;
      let LIMIT = 30;
      let chats = await Chat.find({
        chat_thread_id: thread._id
      }).populate("sender").sort({createdAt: -1}).skip(parseInt(skip)).limit(LIMIT);
      res.json({status: true, message: "Lấy chat thành công", data: chats, chat_thread: thread, user: userChatWith});
    }catch(err) {
      res.status(500).json({status: false, message: err.message});
    }
  }
  async getAllThread(req, res) {
    const user = req.user
    try {
      let threads = await ChatThread.find({
        users: user._id
      }).populate("users").populate("last_message").lean();
      return res.json({status: true, message: "Lấy thread thành công", data: threads});
    }catch(err) {
      res.status(500).json({status: false, message: err.message});
    }
  }
  async getChat(req, res) {
    
  }

  async chat(req, res) {
    const user = req.user
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
        let chat_thread_id = fields.chat_thread_id[0];
        const content = fields.content[0];
        const user_chat_id = fields.user_chat_id[0];
        let threadChatDb = null
        // let 
        if(chat_thread_id == "null" || chat_thread_id == "undefined") {
          let findThread = await ChatThread.findOne({
            users: { $all: [user._id, user_chat_id] }
          });
          if(findThread) {
            chat_thread_id = findThread._id
            threadChatDb = findThread
          }else {
            threadChatDb = new ChatThread({
              users: [user._id, user_chat_id],
            })
            await threadChatDb.save();
            chat_thread_id = threadChatDb._id
          }
        }else {
          threadChatDb = await ChatThread.findOne({_id: chat_thread_id});
          if(!threadChatDb) {
            return res.json({status: false, message: "Không tìm thấy thread chat"});
          }
          chat_thread_id = threadChatDb._id
        }

        let files_data = []
        if (files?.files?.length > 0) {
          for(const file of files.files) {
            let fileType = file.headers["content-type"].split("/")[0];
            if (fileType == "image") {
              let result = await uploadImage(file);
              let file_link = result.secure_url;
              files_data.push({type: "image", url: file_link, public_id: result.public_id, file_name: file.originalFilename, size: file.size})
            }else {
              let file_link = await uploadFile(file);
              files_data.push({type: "file", url: file_link, file_name: file.originalFilename, size: file.size})
            }
          }
        }

        let chat = new Chat({
          sender: user._id,
          content: content,
          chat_thread_id,
          files: files_data
        });
        await chat.save();
        // update thread chat
        // threadChatDb.last_message = chat._id;
        // await threadChatDb.save();
        await ChatThread.findOneAndUpdate({_id: threadChatDb._id}, {last_message: chat._id, new: true});
        let chatThreadNew = await ChatThread.findOne({_id: chat_thread_id}).populate("users").populate("last_message").lean();
        let chatNew = await Chat.findOne({_id: chat._id}).populate("sender").lean()
        res.json({status: true, message: "Gửi tin nhắn thành công", chat: chatNew, thread: chatThreadNew});
    });
  }

  async deleteChat(req, res) {
    try {
      const { chat_id } = req.body;
      let chat = await Chat.findById(chat_id)
      if(!chat) {
        return res.json({status: false, message: "Không tìm thấy chat"});
      }
      chat.deleted = true;
      await chat.save();
      res.json({status: true, message: "Xóa chat thành công"});
    }catch(err) {
      res.status(500).json({status: false, message: err.message});
    }
  }
}
module.exports = new ChatController();
