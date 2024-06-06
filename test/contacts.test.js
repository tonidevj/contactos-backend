const supertest = require('supertest');
const app = require('../app');
const { describe, test, expect, beforeAll } = require('@jest/globals');
const db = require('../db');
const api = supertest(app);
let user;
let contact;
let contacts = [
  {
    name: 'Alejandro Perez',
    phone: '02125424484',
  },
  {
    name: 'Pedro Gonzalez',
    phone: '04145877896',
  },
  {
    name: 'Gabriel Garcia',
    phone: '04122110509',
  },
];
// supertest: Biblioteca para probar aplicaciones HTTP.
// app: Importa la aplicación Express.
// { describe, test, expect, beforeAll }: Funciones de Jest para estructurar y ejecutar las pruebas.
// db: Importa la instancia de la base de datos.
// api: Instancia de supertest configurada con la aplicación Express.
// let user;: Variable para almacenar un usuario creado antes de las prueba.

describe('ruta contacts', () => {
  describe('crear contact', () => {
    beforeAll(() => {
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('gabitodev@gmail.com');
    });
    test('crea un contacto cuando todo es correcto', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Gabriel Gracia', phone: '04122901607' })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        contact_id: 1,
        name: 'Gabriel Gracia',
        phone: '04122901607',
        user_id: 1,
      });
    });

    // cunado el numero es repetido
    test('cuando el numero es repetido', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Gabriel Gracia', phone: '04122901607' })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({ error: 'el numero es repetido' });
    });

    // cuando el nombre no cumple regex
    test('devuelve un error cuando el nombre es invalido', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'G gracia', phone: '04122901607' })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({ error: 'El nombre es invalido.' });
    });
    // cuando el numero es incorrecto
    test('devuelve un error cuando el numero es invalido', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Gabriel Gracia', phone: '041229021607' })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({ error: 'El numero es invalido.' });
    });
  });
  describe('eliminar contacto', () => {
    beforeAll(() => {
      // Creo un usuario
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('gabitodev@gmail.com');

      // Creo un contacto
      const statementDeleteContacts = db.prepare('DELETE FROM contacts');
      statementDeleteContacts.run();
      const statementCreateContact = db.prepare(
        `
      INSERT INTO contacts (name, phone, user_id) VALUES (?, ?, ?) RETURNING *
    `,
      );
      contact = statementCreateContact.get('Gabriel Garcia', '04122110509', user.user_id);
    });

    test('elimina un contacto cuando todo es correcto', async () => {
      const response = await api
        .delete(`/api/contacts/${contact.contact_id}`)
        .query({ userId: user.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'El contacto Gabriel Garcia ha sido eliminado',
      });
    });
    test('no elimina cuando el usuario no pertenece al contacto', async () => {
      const response = await api
        .delete(`/api/contacts/${contact.contact_id}`)
        .query({ userId: user.user_id + 1 })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'El contacto no existe',
      });
    });
    test('no elimina cuando el contacto no existe', async () => {
      const response = await api
        .delete(`/api/contacts/${contact.contact_id + 1}`)
        .query({ userId: user.user_id })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'El contacto no existe',
      });
    });
  });
  describe('actualizar contacto', () => {
    beforeAll(() => {
      // Creo un usuario
      const statementDeleteUsers = db.prepare('DELETE FROM users');
      statementDeleteUsers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('gabitodev@gmail.com');

      // Creo un contacto
      const statementDeleteContacts = db.prepare('DELETE FROM contacts');
      statementDeleteContacts.run();
      const statementCreateContact = db.prepare(
        `
      INSERT INTO contacts (name, phone, user_id) VALUES (?, ?, ?) RETURNING *
    `,
      );
      contact = statementCreateContact.get('Gabriel Garcia', '04122110509', user.user_id);
    });
    test('Actualiza un contacto cuando todo es correcto', async () => {
      const response = await api
        .put(`/api/contacts/${contact.contact_id}`)
        .send({ name: 'Antoni Gracias', phone: '04122346896' })
        .query({ userId: user.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        contact_id: 1,
        name: 'Antoni Gracias',
        phone: '04122346896',
        user_id: 1,
      });
    });
    test('no actualiza cuando el usuario no pertenece al contacto', async () => {
      const response = await api
        .put(`/api/contacts/${contact.contact_id}`)
        .send({ name: 'Antoni Gracias', phone: '04122346896' })
        .query({ userId: user.user_id + 1 })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'El contacto no es valido',
      });
    });
    test('no actualiza cuando el contacto no existe', async () => {
      const response = await api
        .put(`/api/contacts/${contact.contact_id + 1}`)
        .send({ name: 'Antoni Gracias', phone: '04122346896' })
        .query({ userId: user.user_id })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'El contacto no es valido',
      });
    });
  });
  describe('obtener contactos', () => {
    beforeAll(() => {
      // Creo un usuario
      //elimino el user porque los obtine del array
      // Creo un contacto// Creo un contacto
      const statementDeleteContacts = db.prepare('DELETE FROM contacts');
      statementDeleteContacts.run();

      contacts = contacts.map((contact) => {
        const statementCreateContact = db.prepare(
          `
        INSERT INTO contacts (name, phone, user_id) VALUES (?, ?, ?) RETURNING *
      `,
        );
        return statementCreateContact.get(contact.name, contact.phone, user.user_id);
      });
    });
    test('obtener los contactos cuando todo es correcto', async () => {
      const response = await api
        .get('/api/contacts/')
        .query({ userId: user.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body.length).toBe(contacts.length);
    });
    test('no obtener los contactos cuando el ususario no inicio sesion', async () => {
      const response = await api
        .put('/api/contacts/')
        .query({ userId: null })
        .expect(401)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        error: 'No tienes los perimisos',
      });
    });
  });
});

// hacer la ruta de eliminar, y que solo el usuario pueda eliminar un contacto.
// con test, obligatoria la ruta de eliminar. leer documentacion sql
// primero se crea el usuario y luego la ruta como tal
