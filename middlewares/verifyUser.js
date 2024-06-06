const verifyUser = (request, response, next) => {
  if (!request.query.userId) {
    return response.status(401).json({ error: 'No tienes los perimisos' });
  }

  return next();
};

module.exports = verifyUser;
