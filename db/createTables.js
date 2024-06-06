const db = require('.');

// Función para crear la tabla usuarios
const createUsersTable = async () => {
  const statement = db.prepare(`
  CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE
  )
  `);
  statement.run();
  console.log('Tabla de usuarios creada');
};

// Función para crear la tabla de contactos
const createContactsTable = async () => {
  const statement = db.prepare(`
  CREATE TABLE contacts (
    contact_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users (user_id)
      ON DELETE CASCADE
  )
  `);
  statement.run();
  console.log('Tabla de contactos creada');
};

// asegura que las tablas sean creadas una despues de otra 
const createTables = async () => {
  await createUsersTable();
  await createContactsTable();
};

createTables();
