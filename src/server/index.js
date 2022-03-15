const express = require('express')
const cors = require('cors')

const { updateRecencyTable } = require('../database/api')

console.log(__dirname)

const app = express()
const port = 5000

app.use(cors())

app.get('/', (req, res) => {
  res.json({'Hello': 'World!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  updateRecencyTable()
})