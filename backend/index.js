const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { send, getSentences } = require('./mail')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5000

app.get('/', (req, res) => {
  res.send('Server is running.')
})

app.get('/sentences', async (req, res) => {
  res.send(await getSentences())
})

app.post('/notify', (req, res) => {
  send(req, res);
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})