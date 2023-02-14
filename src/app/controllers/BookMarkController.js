const multiparty = require("multiparty");

const User = require("../models/User");
const Post = require("../models/Post");
const PostVote = require("../models/PostVote");
const uploadImages = require("../../utils/uploadImage");
const Comment = require("../models/Comment");
const Bookmark = require("../models/Bookmark");

class BookMarkController {
    async toggleBookmark(req, res, next) {
        const user = req.user;
        try {
          const { post_id } = req.body;
          const bookmark = await Bookmark.findOne({ post: post_id});
          if(bookmark) {
            await Bookmark.deleteOne({post: post_id});
            return res.json({status: true, message: "Xóa bookmark thành công", bookmark: null});
          }else {
            let bookmark = new Bookmark({post: post_id,user_id: user._id});
            await bookmark.save();
            const bookmarkNew = await Bookmark.findOne({_id: bookmark._id}).populate("post").lean();
            return res.json({status: true, message: "Thêm bookmark thành công", bookmark: bookmarkNew});
          }
        }catch(err) {
          console.log(err)
            return res.json({status: false, message: "Có lỗi xảy ra"});
        }
    }
    async getMyBookmark(req, res, next) {
      const user = req.user;
      try {
        const bookmarks = await Bookmark.find({user_id: user._id}).sort({createdAt: -1}).populate("post").lean();
        for(const [index, b] of bookmarks.entries()) {
          const post = b.post;
          const votes = await PostVote.find({post_id: post._id});
          const comments = await Comment.find({post_id: post._id});
          bookmarks[index].post.votes = votes;
          bookmarks[index].post.comments = comments;
          const user = await User.findOne({_id: post.author});
          bookmarks[index].post.author = user;
        }
        return res.json({status: true, message: "Lấy bookmark thành công", bookmarks});
      }catch(err) {
        console.log(err)
        return res.json({status: false, message: "Có lỗi xảy ra"});
      }
    }


    
}

module.exports = new BookMarkController();
