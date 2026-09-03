import express from 'express';

const app = express();
const PORT = process.env.PORT || 4001;

// This is intentionally a trivial service. The gateway is the project -
// this just needs to exist and respond, so we have something real to
// route to and can prove requests actually reach a downstream service.

const users = [
  { id: 1, name: 'Uday' },
  { id: 2, name: 'Test User' },
];

app.get('/', (req, res) => {
  res.json({
    service: 'user-service',
    authenticatedUser: {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'],
    },
    users,
  });
});

app.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ service: 'user-service', user });
});

app.listen(PORT, () => {
  console.log(`user-service listening on port ${PORT}`);
});
