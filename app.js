const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const contactsRouter = require('./routes/contacts');
const verifyUser = require('./middlewares/verifyUser');
const app = express();
// express: Importa el framework Express.
// morgan: Importa Morgan, un middleware de registro de solicitudes HTTP.
// usersRouter y contactsRouter: Importan las rutas de los usuarios y contactos desde los respectivos archivos en la carpeta routes.
// app: Crea una instancia de la aplicación Express.

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
// app.use(express.json()): Utiliza el middleware de Express para analizar las solicitudes con contenido JSON.
// app.use(morgan('tiny')): Configura Morgan para registrar solicitudes HTTP en un formato conciso.
// app.use(express.urlencoded({ extended: true })): Utiliza el middleware de Express para analizar solicitudes con datos codificados en la URL (como formularios). La opción { extended: true } permite manejar objetos anidados.

// Rutas backend
app.get('/', async (request, response) => {
  return response.status(200).json({ hola: 'mundo' });
});
app.use('/api/users', usersRouter);
app.use('/api/contacts', verifyUser, contactsRouter);
// app.get('/'): Define una ruta GET para la raíz (/) de la aplicación.
// async (request, response) => { ... }: Un controlador asíncrono para manejar la solicitud.
// return response.status(200).json({ hola: 'mundo' }): Responde con un estado 200 y un JSON { hola: 'mundo' }.

module.exports = app;
