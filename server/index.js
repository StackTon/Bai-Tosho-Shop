const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
//const statsRoutes = require('./routes/stats')
require('./config/passport')();

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
require('./config/database')(config);

const app = express()

const port = 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(cors())

// routes
app.use('/auth', authRoutes)
app.use('/product', productRoutes)
//app.use('/stats', statsRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
