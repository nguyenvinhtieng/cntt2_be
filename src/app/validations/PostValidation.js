// const {check} = require('express-validator')

const validateCreatePost = [
    check('title')
    .exists().withMessage('Vui lòng điền title')
    .empty().withMessage('title không thể trống'),

    check('content')
    .exists().withMessage('Vui lòng điền content')
    .empty().withMessage('content không thể trống'),

    check('tags')
    .exists().withMessage('Vui lòng điền tags')
    .empty().withMessage('tags không thể trống'),
]

module.exports = {validateCreatePost}