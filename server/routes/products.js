const express = require('express');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const User = require('../models/User');
const authCheck = require('../middleware/auth-check');
const adminCheck = require('../middleware/admin-check');

const router = new express.Router()

function validateProductForm(payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  payload.price = Number(payload.price)

  if (!payload || typeof payload.name !== 'string' || payload.name.length < 3) {
    isFormValid = false
    errors.make = 'Name must be more than 3 symbols.'
  }

  if (!payload || typeof payload.imageUrl !== 'string' || payload.imageUrl.length < 3) {
    isFormValid = false
    errors.model = 'imageUrl must be more than 3 symbols.'
  }

  if (!payload || !payload.price || typeof payload.price !== 'number' || payload.price < 0) {
    isFormValid = false
    errors.price = 'Price is not valid.'
  }

  if (!payload || typeof payload.description !== 'string' || payload.description.length < 10) {
    isFormValid = false
    errors.description = 'Description must be more than 10 symbols.'
  }

  if (!isFormValid) {
    message = 'Check the form for errors.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

async function createProduct(payload) {
  try {
    const res = await Product.create({
      name: payload.name,
      imageUrl: payload.imageUrl,
      description: payload.description,
      creationDate: payload.creationDate,
      price: Number(payload.price),
      likes: [],
      comments: []
    });
    return true;
  }
  catch (e) {
    return e
  }
}

router.post('/create', authCheck, (req, res) => {
  const product = req.body
  const validationResult = validateProductForm(product);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }
  let date = Date.now();
  let creationDate = Date(date);
  product.creationDate = creationDate;
  console.log(product)
  createProduct(product).then(response => {
    if (response === true) {
      return res.status(200).json({
        success: true,
        message: 'Product added successfuly.',
        product
      })
    }
    return res.status(500).json({
      success: false,
      message: 'Mongo db error.',
      product
    })
  })
})

router.get('/all', (req, res) => {
  //const page = parseInt(req.query.page) || 1
  //const search = req.query.search

  Product.find({}).then(product => {
    return res.status(200).json(product)
  })
})

router.post('/delete/:id', authCheck, (req, res) => {
  const id = req.params.id
  Product.findByIdAndRemove(id).then(() => {
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully!'
    })
  }).catch(() => {
    return res.status(400).json({
      success: false,
      message: 'Product does not exists!',
    })
  })
})

router.post('/edit/:id', authCheck, (req, res) => {
  const product = req.body
  const id = req.params.id;
  const validationResult = validateProductForm(product);
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      error: e.message
    })
  }
  Product.findById(id).then(foundProduct => {
    foundProduct.name = product.name,
      foundProduct.imageUrl = product.imageUrl,
      foundProduct.description = product.description,
      foundProduct.price = product.price
    foundProduct.save().then(() => {
      return res.status(200).json({
        success: true,
        message: 'Product edited successfully!'
      })
    }).catch(e => {
      return res.status(404).json({
        success: false,
        message: 'Product does not exists!',
        error: e.message
      })
    })

  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'Product does not exists!',
      error: e.message
    })
  })
})

router.get('/details/:id', authCheck, (req, res) => {
  const id = req.params.id
  Product.findById(id).then(foundProduct => {
    return res.status(200).json(foundProduct)
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'Entry does not exists!',
      error: e.message
    })
  })
})

router.post('/details/:id/comments/create', authCheck, (req, res) => {
  const id = req.params.id
  Product.findById(id).then(foundProduct => {

    const comment = req.body.comment;
    const creator = req.user.username;

    if (!creator) {
      return res.status(400).json({
        success: false,
        message: 'Creator must be send.'
      })
    }

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be a least 1 length.'
      })
    }

    let commentId = foundProduct.comments.length;
    let commentObj = {
      id: commentId,
      comment,
      creator,
      creationDate: Date.now(),
      postId: id
    }
    Comment.create(commentObj).then(comment => {
      foundProduct.comments.push(comment._id);
      foundProduct.save().then(() => {
        return res.status(200).json({
          success: true,
          message: 'Comment added successfuly.',
          comment: commentObj
        })
      }).catch(e => {
        return res.status(404).json({
          success: false,
          message: 'Product does not exists!',
          error: e.message
        })
      })
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'Product does not exists!',
      error: e.message
    })
  })
})

router.get('/details/:id/comments', authCheck, (req, res) => {
  const id = req.params.id

  Product.findById(id).populate('comments').then(foundProduct => {
    res.status(200).json(foundProduct)
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'Furniture does not exists!',
      error: e.message
    })
  })
})

router.get('/details/:postId/comments/delete/:commentId', authCheck, (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  Product.findById(postId).then(foundProduct => {
    let index = foundProduct.comments.indexOf(commentId);
    foundProduct.comments.splice(index, 1);
    foundProduct.save().then(() => {
      Comment.findByIdAndRemove(commentId).then(foundComment => {
        return res.status(200).json({
          success: true,
          message: 'Comment was deleted successfuly.'
        })
      })
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'Product does not exists!',
      error: e.message
    })
  })
})

router.post('/details/:postId/comments/edit/:commentId', authCheck, (req, res) => {
  const commentId = req.params.commentId;
  const commentObj = req.body;
  if (!commentObj.comment || commentObj.comment.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be a least 1 length.'
    })
  }
  if (!commentObj.rating || commentObj.rating < 1 || commentObj.rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5.'
    })
  }
  Comment.findById(commentId).then(foundComment => {
    foundComment.comment = commentObj.comment;
    foundComment.rating = commentObj.rating;
    foundComment.save(() => {
      return res.status(200).json({
        success: true,
        message: 'Comment was edited successfuly.'
      })
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'Product does not exists!',
      error: e.message
    })
  })
})

router.post('/user/buy/:productId', authCheck, (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  User.findById(userId).then(foundUser => {

    foundUser.cart.push(productId);
    foundUser.save().then(() => {
      return res.status(200).json({
        success: true,
        message: 'Product added successfuly to the cart.',
      })
    })

  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'User does not exists!',
      error: e.message
    })
  })
})

router.get('/myproducts', authCheck, (req, res) => {
  const userId = req.user._id;
  User.findById(userId).populate('cart').then(foundUser => {
    return res.status(200).json({
      success: true,
      message: 'Successfuly get user info.',
      data: foundUser
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'User does not exists!',
      error: e.message
    })
  })
})

router.post('/user/remove/:productId', authCheck, (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  User.findById(userId).then(foundUser => {
    let index = foundUser.cart.indexOf(productId);
    foundUser.cart.splice(index, 1);
    foundUser.save().then(() => {
      return res.status(200).json({
        success: true,
        message: 'Successfuly get user info.',
        data: foundUser
      })
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'User does not exists!',
      error: e.message
    })
  })
})

router.post('/details/:productId/like', authCheck, (req, res) => {
  const productId = req.params.productId
  const userId = req.user.username;
  Product.findById(productId).then(foundProduct => {
    foundProduct.likes.push(userId);
    foundProduct.save().then(() => {
      return res.status(200).json({
        success: true,
        message: 'Thank you for your like!'
      })
    })
  }).catch(e => {
    return res.status(400).json({
      success: false,
      message: 'This user has already liked this entry!',
      error: e.message
    })
  })
})

router.post('/details/:productId/dislike', authCheck, (req, res) => {
  const productId = req.params.productId
  const userId = req.user.username;
  Product.findById(productId).then(foundProduct => {
    let index = foundProduct.likes.indexOf(userId);
    foundProduct.likes.splice(index, 1);
    foundProduct.save().then(() => {
      return res.status(200).json({
        success: true,
        message: 'You have successfuly dislike!'
      })
    })
  }).catch(e => {
    return res.status(400).json({
      success: false,
      message: 'This user has already liked this entry!',
      error: e.message
    })
  })
});

router.get('/users',authCheck, (req, res) => {
  User.find({}).then(data => {
    return res.status(200).json({
      success: true,
      users: data
    })
  }).catch(e => {
    return res.status(400).json({
      success: false,
      message: 'Mongo db error',
      error: e.message
    })
  })
})

router.post('/users/make-admin/:userId', authCheck, (req, res) => {
  const userId = req.params.userId;
  User.findById(userId).then(foundUser => {
    foundUser.isAdmin = true;
    foundUser.save().then(() => {
      return res.status(200).json({
        success: true,
        message: "You have successfully make an admin!"
      })
    }).catch(e => {
      return res.status(500).json({
        success: false,
        message: 'Mongo db error',
        error: e.message
      })
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'User not foun',
      error: e.message
    })
  })
})

router.post('/users/take-admin/:userId', authCheck, (req, res) => {
  const userId = req.params.userId;
  User.findById(userId).then(foundUser => {
    foundUser.isAdmin = false;
    foundUser.save().then(() => {
      return res.status(200).json({
        success: true,
        message: "You have successfully take an admin role!"
      })
    }).catch(e => {
      return res.status(500).json({
        success: false,
        message: 'Mongo db error',
        error: e.message
      })
    })
  }).catch(e => {
    return res.status(404).json({
      success: false,
      message: 'User not foun',
      error: e.message
    })
  })
})
module.exports = router;