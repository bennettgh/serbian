const express = require('express')
const cors = require('cors')

const { readTable, updateRecencyTable } = require('../database/api')
const { VERBS_TABLE_NAME } = require('../database/constants')

console.log(__dirname)

const app = express()
const port = 5000

app.use(cors())

app.get('/', (req, res) => {
  res.json({'Hello': 'World!'})
})

app.get('/infinitives', (req, res) => {
  res.json(Object.keys(readTable(VERBS_TABLE_NAME)))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  updateRecencyTable()
})