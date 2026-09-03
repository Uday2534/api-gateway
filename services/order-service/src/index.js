import express from 'express';

const app = express();
const PORT = process.env.PORT || 4002;

const orders = [
  { id: 101, userId: 1, item: 'Mechanical Keyboard', total: 4500 },
  { id: 102, userId: 1, item: 'Monitor', total: 12000 },
];

app.get('/', (req, res) => {
  res.json({
    service: 'order-service',
    authenticatedUser: {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'],
    },
    orders,
  });
});

app.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ service: 'order-service', order });
});

app.listen(PORT, () => {
  console.log(`order-service listening on port ${PORT}`);
});
