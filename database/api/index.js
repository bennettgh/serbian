const fs = require('fs')
const { 
  VERBS_TABLE_NAME, 
  RECENCY_TABLE_NAME, 
  BACKUPS_DIR_NAME, 
  TABLES_DIR_NAME,
  MAX_RECENCY_EVENTS 
} = require('../constants')

// Helpers

const findDatabaseDirectory = () => {
  const fullFilePath = __dirname.split("/")
  while (fullFilePath[fullFilePath.length - 1] !== 'serbian') { // IMPORTANT THIS MATCHES THE PROJECT DIRECTORY NAME
    fullFilePath.pop()
  }

  return `${fullFilePath.join('/')}/database`
}

const findTablesDirectory = () => `${findDatabaseDirectory()}/${TABLES_DIR_NAME}`
const findBackupsDirectory = () => `${findDatabaseDirectory()}/${BACKUPS_DIR_NAME}`

const readTable = (table) =>JSON.parse(fs.readFileSync(`${findTablesDirectory()}/${table}.json`))//require(`${findTablesDirectory()}/${table}`)

const backupTable = (tableName) => {
  fs.copyFileSync(
    `${findTablesDirectory()}/${tableName}.json`, 
    `${findBackupsDirectory()}/${tableName}/${new Date().toISOString()}.json`
  );
}

const overwriteTable = (table, data) => {
  backupTable(table)
  fs.writeFileSync(
    `${findTablesDirectory()}/${table}.json`, 
    JSON.stringify(data, null, 2)
  );
}

const createEntry = (table, key, value) => {
  const tableData = readTable(table)
  // entry exists
  if (tableData[key] !== undefined) return false
  overwriteTable(table, { ...tableData, [key]: value })
  console.log(`wrote ${key} to ${table} table`)
  return true
}

const updateEntry = (table, key, value) => {
  const tableData = readTable(table)
  // entry does not exist
  if (tableData[key] === undefined) return false

  overwriteTable(table, { ...tableData, [key]: value })
  console.log(`updated ${key} in ${table} table`)
  return true
}


const insertVerb = (infinitive, conjugations) => {
  return createEntry(VERBS_TABLE_NAME, infinitive, conjugations)
}

const syncRecencyTable = () => {
  // ensure recency entries exist for all verbs
  const verbData = readTable(VERBS_TABLE_NAME)
  for (let verb of Object.keys(verbData)) {
    createEntry(RECENCY_TABLE_NAME, verb, [])
  }

  // clear old recency events
  const recencyData = readTable(RECENCY_TABLE_NAME)
  for (let verb of Object.keys(recencyData)) {
    if (recencyData[verb].length > MAX_RECENCY_EVENTS) {
      updateEntry(RECENCY_TABLE_NAME, verb, recencyData[verb].slice(0, MAX_RECENCY_EVENTS))
    }
  }
}

const insertRecencyEvent = (key, result) => {
  const recencyData = readTable(RECENCY_TABLE_NAME)

  const event = { 
    result, 
    time: new Date().getTime()
  }

  if (recencyData[key] !== undefined) {
    const newValue =  [...recencyData[key], event]
    return updateEntry(RECENCY_TABLE_NAME, key, newValue)
  } else {
    return createEntry(RECENCY_TABLE_NAME, key, [event])
  }
}

module.exports = {
  syncRecencyTable,
  insertVerb,
  insertRecencyEvent,
  readTable
}

