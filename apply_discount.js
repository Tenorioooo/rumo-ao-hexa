const fs = require('fs');
const file = 'lib/products.js';
let content = fs.readFileSync(file, 'utf8');

// Replace price
content = content.replace(/price:\s*([\d.]+)/g, (match, p1) => {
    return `price: ${(parseFloat(p1) * 0.5).toFixed(2)}`;
});

// Replace originalPrice 
content = content.replace(/originalPrice:\s*([\d.]+)/g, (match, p1) => {
    return `originalPrice: ${(parseFloat(p1) * 0.5).toFixed(2)}`;
});

fs.writeFileSync(file, content);
console.log('Prices updated successfully!');
