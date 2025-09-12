require("dotenv").config()

const { Pool } = require("pg");

//create a new pool instance to manage db connection

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function query(text, params) {
  const start = Date.now()

  try {
    const result = await pool.query(text, params)

    //execute the time
    const duration = Date.now() - start

    console.log('Executed query', {
      text,
      duration,
      rows: result.rowCount
    })

    return result
  } catch (error) {
    console.log('Failed query', {
      text,
      error: error.stack
    });

    throw error
  }
}

module.exports = { query }