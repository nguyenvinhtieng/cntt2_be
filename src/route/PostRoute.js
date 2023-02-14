const express = require('express');
const router = express.Router();

const PostController = require('../app/controllers/PostController.js');
const checkLogin = require('../app/middleware/checkLogin.js')

router.get("/get-posts", PostController.getPagination);
router.get("/my-post", checkLogin, PostController.getMyPost);
router.post("/get-post-user", PostController.getPostUser)
router.post('/', checkLogin, PostController.create)
router.post('/vote', checkLogin, PostController.votePost)
router.get('/:slug', PostController.get);
router.post('/delete',checkLogin, PostController.deletePost)
router.post('/update',checkLogin, PostController.updatePost)

module.exports = router;
