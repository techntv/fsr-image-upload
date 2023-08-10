require('dotenv').config()
require('./database/database.js').connect()
const express = require('express')
const app = express()
const router = require('./routes/index.js')
const auth = require('./middleware/auth')
const cors = require('cors')

const port = 8080

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, '/frontend/build')))
app.use('/uploads', express.static('./uploads'))

app.use('/', router)

app.post('/api/hello', auth, (req, res) => {
  res.status(200).send('Hello 🙌 ')
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'))
})

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`)
})
