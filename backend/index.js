require('dotenv').config()
require('./database/database.js').connect()
const express = require('express')
const app = express()
const router = require('./routes/index.js')
const auth = require('./middleware/auth')
const cors = require('cors')
const path = require('path')

const port = 8080
const CLIENT_BUILD_PATH = path.join(__dirname, '../../app/frontend/build')

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//  Route for client static
app.use(express.static(CLIENT_BUILD_PATH))
app.use('/uploads', express.static('./uploads'))

app.use('/', router)

app.post('/api/hello', auth, (req, res) => {
  res.status(200).send('Hello 🙌 ')
})

// Server React Client
app.get('/', function (req, res) {
  res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'))
})

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`)
})
