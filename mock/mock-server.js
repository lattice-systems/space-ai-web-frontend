const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route for authentication
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@spaceia.edu' && password === 'Admin123!') {
    res.json({
      accessToken: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      user: {
        id: 'uuid-123',
        name: 'Administrador SpaceIA',
        email: 'admin@spaceia.edu',
        folio: 'ADM001',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
