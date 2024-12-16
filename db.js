
import * as SQLite from 'expo-sqlite';

let db;

const initilizeDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('pedometer.db'); // Assign to global db variable

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        steps INTEGER NOT NULL
      );
    `);
    console.log('Database initialized successfully.');
  }
};

export const insertSteps = async (steps) => {
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  try {
    // Check if there is an entry for the current date
    const existingEntry = await db.getAllAsync(
      `SELECT * FROM steps WHERE date = ?;`,
      [currentDate]
    );

    if (existingEntry.length > 0) {
      // Update the existing entry by adding the new steps
      await db.runAsync(
        `UPDATE steps
         SET steps = steps + ?
         WHERE date = ?;`,
        [steps, currentDate]
      );
      console.log(`Steps updated for ${currentDate} ${steps}`);
    } else {
      // Insert a new entry for the date
      await db.runAsync(
        `INSERT INTO steps (date, steps)
         VALUES (?, ?);`,
        [currentDate, steps]
      );
      console.log(`Steps inserted for ${currentDate}`);
    }
  } catch (error) {
    console.error('Error inserting/updating steps:', error);
  }
};

export const getStepsByDate = async (date) => {
  try {
    const stepsData = await db.getAllAsync(
      `SELECT * FROM steps WHERE date = ?;`,
      [date]
    );

    if (stepsData.length > 0) {
      return stepsData[0].steps; // Return the steps for the given date
    } else {
      return 0; // Return 0 if no data exists for the date
    }
  } catch (error) {
    console.error('Error fetching steps by date:', error);
    return 0;
  }
};

export default {
  initilizeDb,
  getStepsByDate,
  insertSteps,
};
