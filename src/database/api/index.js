const fs = require('fs')
const { VERBS_TABLE_NAME, RECENCY_TABLE_NAME, BACKUPS_DIR_NAME, TABLES_DIR_NAME } = require('../constants')

// Helpers

const findDatabaseDirectory = () => {
  const fullFilePath = __dirname.split("/")
  while (fullFilePath[fullFilePath.length - 1] !== 'src') {
    fullFilePath.pop()
  }

  return `${fullFilePath.join('/')}/database`
}

const findTablesDirectory = () => `${findDatabaseDirectory()}/${TABLES_DIR_NAME}`
const findBackupsDirectory = () => `${findDatabaseDirectory()}/${BACKUPS_DIR_NAME}`

// General API

const readTable = (table) => require(`${findTablesDirectory()}/${table}`)

const backupTable = (tableName) => {
  fs.copyFileSync(
    `${findTablesDirectory()}/${tableName}.json`, 
    `${findBackupsDirectory()}/${tableName}/${new Date().getTime()}.json`
  );
}

const insertValueSafely = (tableName, key, value) => {
  const data = readTable(tableName)

  if (data[key]) {
    return false
  } else {
    data[key] = value
  }

  fs.writeFileSync(`${findTablesDirectory()}/${tableName}.json`, JSON.stringify(data, null, 2));
  console.log(`wrote ${key} to ${tableName} table`)
  return true
}

// Special API

const updateRecencyTable = () => {
  backupTable(RECENCY_TABLE_NAME)

  const verbData = readTable(VERBS_TABLE_NAME)

  for (let verb of Object.keys(verbData)) {
    insertValueSafely(RECENCY_TABLE_NAME, verb, [])
  }
}

module.exports = {
  readTable,
  insertValueSafely,
  updateRecencyTable,
  backupTable
}

