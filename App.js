const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

const products = [
  { id: uuidv4(), productName: 'Laptop1', category: 'Laptop', price: 2236, rating: 4.7, discount: 63, availability: 'yes', company: 'AMZ' },
  { id: uuidv4(), productName: 'Laptop2', category: 'Laptop', price: 1500, rating: 4.5, discount: 10, availability: 'yes', company: 'FLP' },
  { id: uuidv4(), productName: 'Phone1', category: 'phone', price: 999, rating: 4.8, discount: 20, availability: 'no', company: 'SNP' },

];


// For sorting products..
const sortProducts = (products, sortBy, order) => {
  return products.sort((a, b) => {
    if (order === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });
};

// GET /categories/:categoryname/products
app.get('/categories/:categoryname/products', (req, res) => {
  const { categoryname } = req.params;
  const { n = 10, page = 1, sortBy, order = 'asc' } = req.query;
  let filteredProducts = products.filter(product => product.category.toLowerCase() === categoryname.toLowerCase());

 
  if (sortBy) {
    filteredProducts = sortProducts(filteredProducts, sortBy, order);
  }

// Enabling Pagination..
  const pageSize = Math.min(parseInt(n, 10), 10);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  res.json(paginatedProducts.map(product => ({
    productName: product.productName,
    price: product.price,
    rating: product.rating,
    discount: product.discount,
    availability: product.availability
  })));
});


app.get('/categories/:categoryname/products/:productid', (req, res) => {
  const { categoryname, productid } = req.params;
  const product = products.find(p => p.id === productid && p.category.toLowerCase() === categoryname.toLowerCase());

  if (product) {
    res.json({
      productName: product.productName,
      price: product.price,
      rating: product.rating,
      discount: product.discount,
      availability: product.availability
    });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
