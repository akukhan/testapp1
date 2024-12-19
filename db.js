
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
        steps INTEGER NOT NULL,
        distance REAL,
        calories REAL
      );
    `);

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS user  (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT,
        goal REAL,
        height REAL,        -- Height in cm or inches
        weight REAL,        -- Weight in kg or pounds
        bmi REAL,           -- Calculated BMI
        created_at TEXT,    -- Date when profile was created
        updated_at TEXT     -- Last update timestamp
      );
    `);
    console.log('Database initialized successfully. user and steps tables');


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
console.log(existingEntry, "existing entry")
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

export const getAllSteps = async () => {
  try {
    const stepsData = await db.getAllAsync(`SELECT * FROM steps ORDER BY date ASC;`);
    return stepsData; // Return all step entries
  } catch (error) {
    console.error('Error fetching all steps:', error);
    return [];
  }
};

export const getStepsForWeek = async (startDate, endDate) => {
  try {
    const stepsData = await db.getAllAsync(
      `SELECT * FROM steps WHERE date BETWEEN ? AND ? ORDER BY date ASC;`,
      [startDate, endDate]
    );
    return stepsData; // Return steps for the given week
  } catch (error) {
    console.error('Error fetching weekly steps:', error);
    return [];
  }
};

export const insertOrUpdateUser = async (user) => {
  try {
    const existingUser = await db.getAllAsync(`SELECT * FROM user WHERE id = 1;`);
    if (existingUser.length > 0) {
      // Update user profile
      await db.runAsync(
        `UPDATE user 
         SET nickname = ?, height = ?, weight = ?, bmi = ?, updated_at = datetime('now') 
         WHERE id = 1;`,
        [user.nickname, user.height, user.weight, user.bmi]
      );
      console.log("User profile updated successfully.");
    } else {
      // Insert new user profile
      await db.runAsync(
        `INSERT INTO user (nickname, height, weight, bmi, created_at, updated_at) 
         VALUES (?, ?, ?, ?, datetime('now'), datetime('now'));`,
        [user.nickname, user.height, user.weight, user.bmi]
      );
      console.log("User profile created successfully.");
    }
  } catch (error) {
    console.error("Error inserting/updating user profile:", error);
  }
};

export const getUserProfile = async () => {
  try {
    const userProfile = await db.getAllAsync(`SELECT * FROM user WHERE id = 1;`);
    return userProfile.length > 0 ? userProfile[0] : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const saveStepGoal = async (goal) => {
  try {
    const existingUser = await db.getAllAsync(`SELECT * FROM user WHERE id = 1;`);
    if (existingUser.length > 0) {
      // Update the step goal
      await db.runAsync(
        `UPDATE user 
         SET goal = ?, updated_at = datetime('now') 
         WHERE id = 1;`,
        [goal]
      );
      console.log("Step goal updated successfully.");
    } else {
      // Insert a new user with the step goal if no user exists
      await db.runAsync(
        `INSERT INTO user (goal, created_at, updated_at) 
         VALUES (?, datetime('now'), datetime('now'));`,
        [goal]
      );
      console.log("Step goal set for the first time.");
    }
  } catch (error) {
    console.error("Error saving step goal:", error);
  }
};



export default {
  initilizeDb,
  insertSteps,
  getStepsByDate,
  getAllSteps,
  getStepsForWeek,
  insertOrUpdateUser,
  getUserProfile,
};
