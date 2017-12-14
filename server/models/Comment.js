const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.String, required: true, ref: 'User'},
  creationDate: {type: mongoose.Schema.Types.Date, required: true},
  postId:  {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'}
})

module.exports = mongoose.model('Comment', commentSchema);