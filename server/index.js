const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { readTable, syncRecencyTable, insertRecencyEvent } = require('../database/api')
const { VERBS_TABLE_NAME } = require('../database/constants')

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({'Hello': 'World!'})
})

app.get('/verbs', (req, res) => {
  res.json(readTable(VERBS_TABLE_NAME))
})

app.post('/events', (req, res) => {
  const key = req.body.key
  const result = req.body.result

  if (insertRecencyEvent(key, result)) {
    res.sendStatus(201)
  } else {
    res.sendStatus(400)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  syncRecencyTable()
})