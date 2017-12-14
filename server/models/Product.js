const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  imageUrl: {type: String, required: true, unique: true},
  description: {type: String, required: true},
  creationDate: {type: String, required: true},
  price: {type: Number, required: true},
  likes: [{type: mongoose.Schema.Types.String, ref: 'User'}],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}]
})

module.exports = mongoose.model('Product', productSchema);