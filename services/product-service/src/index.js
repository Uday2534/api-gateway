import express from 'express';

const app = express();
const PORT = process.env.PORT || 4003;

const products = [
  { id: 1, name: 'Mechanical Keyboard', price: 4500 },
  { id: 2, name: 'Monitor', price: 12000 },
];

app.get('/', (req, res) => {
  res.json({
    service: 'product-service',
    authenticatedUser: {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'],
    },
    products,
  });
});

app.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ service: 'product-service', product });
});

app.listen(PORT, () => {
  console.log(`product-service listening on port ${PORT}`);
});
