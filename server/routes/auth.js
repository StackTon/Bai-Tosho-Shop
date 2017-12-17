const express = require('express');
const passport = require('passport');
const validator = require('validator');
const encryption = require('../util/encryption');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = new express.Router()

function validateSignupForm(payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.username !== 'string') {
    isFormValid = false
    errors.username = 'Please provide a correct username.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 1) {
    isFormValid = false
    errors.password = 'Password must have at least 4 characters.'
  }

  if (!payload || typeof payload.firstName !== 'string') {
    isFormValid = false
    errors.firstName = 'Please provide your firstName.'
  }

  if (!payload || typeof payload.lastName !== 'string') {
    isFormValid = false
    errors.lastName = 'Please provide your lastName.'
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

function validateLoginForm(payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false
    errors.username = 'Please provide your username.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false
    errors.password = 'Please provide your password.'
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

async function loginUser(userData) {
  try {
    const user = await User.findOne({ username: userData.username });
    if (!user) {
      return errorHandler('Invalid user data');
    }
    if (!user.authenticate(userData.password)) {
      return errorHandler('Invalid user data');
    }
    const token = jwt.sign(userData.username, 's0m3 r4nd0m str1ng') 
    return {
      success: true,
      message: 'You have successfully logged in!',
      token,
      username: userData.username,
      isAdmin: user.isAdmin
    }

  } catch (e) {
    return errorHandler(e);
  }
}

async function registerUser(userData) {
  const reqUser = userData;
  const salt = encryption.generateSalt();
  const hashedPass = encryption.generateHashedPassword(salt, reqUser.password);
  try {
    const user = await User.create({
      username: reqUser.username,
      hashedPass,
      salt,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      isAdmin: false
    });
    const token = jwt.sign(userData.username, 's0m3 r4nd0m str1ng')
    return {
      success: true,
      message: 'You have successfully register!',
      token,
      username: userData.username,
      isAdmin: false
    }
    
  } catch (e) {
    console.log(e);
    return errorHandler(e);
  }
}

function errorHandler(err) {
  return {
    success: false,
    message: err
  }
}

router.post('/register', (req, res, next) => {
  const validationResult = validateSignupForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }
  registerUser(req.body).then(responseRegister => {
    return res.status(200).json(responseRegister)
  })

})

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body)
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }
  loginUser(req.body).then(response => {
    return res.status(200).json(response)
  })
})

module.exports = router