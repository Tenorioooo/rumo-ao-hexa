const fs = require('fs');

const html = fs.readFileSync('capita_page.html', 'utf8');

// The items are likely inside <div class="js-item-product ...">
const nameRegex = /data-store="product-item-name-[0-9]+">([^<]+)<\/div>/g;
const imgRegex = /data-srcset="([^ ]+) /g; // or something similar
const priceRegex = /class="js-price-display[^>]*>([^<]+)<\/span>/g;
const urlRegex = /<a href="([^"]+)" class="item-link/g;

// Let's use a simpler approach: splitting by item container
const containers = html.split('js-item-product');
const products = [];

for (let i = 1; i < containers.length; i++) {
  const container = containers[i];
  
  const nameMatch = container.match(/data-store="product-item-name-[0-9]+">([^<]+)<\/div>/);
  const imgMatch = container.match(/data-srcset="([^ ]+) /) || container.match(/src="([^"]+)"/);
  const priceMatch = container.match(/js-price-display[^>]*>([^<]+)<\/span>/);
  
  if (nameMatch) {
    let name = nameMatch[1].trim();
    let image = imgMatch ? imgMatch[1] : '';
    // ensure image is absolute
    if (image && image.startsWith('//')) image = 'https:' + image;
    
    products.push({
      id: i + 6, // we already have 6 products
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: name,
      team: 'Brasil',
      flag: '🇧🇷',
      edition: name.includes('Copa') ? name.match(/Copa [0-9]+/)?.[0] || 'Especial' : 'Atual',
      image: image,
      price: 175.90, // mock default price
      originalPrice: 249.90,
      category: 'america-sul',
      sizes: ['P', 'M', 'G', 'GG', 'XG'],
      badge: '',
      badgeType: 'green',
      description: `Camisa oficial ${name}. Ideal para torcedores apaixonados.`,
      features: ['Modelo Oficial', 'Tecido 100% poliéster', 'Escudo bordado'],
      inStock: true,
      rating: 4.8,
      reviews: Math.floor(Math.random() * 200) + 10
    });
  }
}

// deduplicate products by name
const uniqueProducts = [];
const names = new Set();
for (const p of products) {
  if (!names.has(p.name)) {
    names.add(p.name);
    uniqueProducts.push(p);
  }
}

console.log(JSON.stringify(uniqueProducts, null, 2));
