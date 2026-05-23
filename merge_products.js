const fs = require('fs');

let productsJs = fs.readFileSync('lib/products.js', 'utf8');
const newProducts = JSON.parse(fs.readFileSync('new_products.json', 'utf8'));

// Extract existing products to find their slugs
const existingSlugs = ['brasil-copa-1998-home', 'brasil-copa-1994-home', 'brasil-amarela-home-atual', 'brasil-azul-away-atual', 'brasil-copa-2002-away', 'brasil-copa-2006-away'];

// Actually, let's just parse the file carefully. 
// We will replace the products array. We find the end of the products array.
const categoriesIndex = productsJs.indexOf('export const categories =');
const topPart = productsJs.substring(0, productsJs.indexOf('];\n\nexport const categories ='));

// wait, safer to just find the array content.
// Since we have the new products, we will just format them into JS and append to the existing list.
let newProductsFormatted = '';
for (const p of newProducts) {
  if (existingSlugs.includes(p.slug) || existingSlugs.some(s => s.replace('-atual', '') === p.slug.replace('camisa-', '').replace('do-', ''))) {
    // skip duplicates
    continue;
  }
  
  // also fix the "-240-0" in the image URL to "-480-0" for better quality
  const img = p.image.replace('-240-0', '-480-0');
  
  newProductsFormatted += `  {
    id: ${p.id},
    slug: '${p.slug}',
    name: '${p.name}',
    team: '${p.team}',
    flag: '${p.flag}',
    edition: '${p.edition}',
    image: '${img}',
    price: ${p.price.toFixed(2)},
    originalPrice: ${p.originalPrice.toFixed(2)},
    category: '${p.category}',
    sizes: ${JSON.stringify(p.sizes)},
    badge: '',
    badgeType: '${p.badgeType}',
    description: '${p.description}',
    features: ${JSON.stringify(p.features)},
    inStock: ${p.inStock},
    rating: ${p.rating.toFixed(1)},
    reviews: ${p.reviews},
  },\n`;
}

// insert before the closing bracket of products array
const insertionPoint = productsJs.lastIndexOf('];', categoriesIndex);
productsJs = productsJs.substring(0, insertionPoint) + newProductsFormatted + productsJs.substring(insertionPoint);

fs.writeFileSync('lib/products.js', productsJs);
console.log('Merged successfully. Added new products.');
