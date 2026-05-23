const fs = require('fs');

const files = [
  '/Users/macbook/.gemini/antigravity/brain/c2ee108b-b599-400e-970f-973cb4dcee75/.system_generated/steps/4/content.md',
  '/Users/macbook/.gemini/antigravity/brain/c2ee108b-b599-400e-970f-973cb4dcee75/.system_generated/steps/33/content.md'
];

const products = [];
const names = new Set();
let currentId = 50; // start IDs from 50 to avoid conflicts

// Helper to determine team from name
function getTeamInfo(name) {
  const n = name.toLowerCase();
  if (n.includes('brasil')) return { team: 'Brasil', flag: '🇧🇷', category: 'america-sul' };
  if (n.includes('argentina')) return { team: 'Argentina', flag: '🇦🇷', category: 'america-sul' };
  if (n.includes('uruguai')) return { team: 'Uruguai', flag: '🇺🇾', category: 'america-sul' };
  if (n.includes('colômbia') || n.includes('colombia')) return { team: 'Colômbia', flag: '🇨🇴', category: 'america-sul' };
  if (n.includes('chile')) return { team: 'Chile', flag: '🇨🇱', category: 'america-sul' };
  
  if (n.includes('alemanha')) return { team: 'Alemanha', flag: '🇩🇪', category: 'europa' };
  if (n.includes('espanha')) return { team: 'Espanha', flag: '🇪🇸', category: 'europa' };
  if (n.includes('frança') || n.includes('franca')) return { team: 'França', flag: '🇫🇷', category: 'europa' };
  if (n.includes('inglaterra')) return { team: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', category: 'europa' };
  if (n.includes('italia') || n.includes('itália')) return { team: 'Itália', flag: '🇮🇹', category: 'europa' };
  if (n.includes('portugal')) return { team: 'Portugal', flag: '🇵🇹', category: 'europa' };
  if (n.includes('holanda')) return { team: 'Holanda', flag: '🇳🇱', category: 'europa' };
  if (n.includes('croácia') || n.includes('croacia')) return { team: 'Croácia', flag: '🇭🇷', category: 'europa' };
  if (n.includes('bélgica') || n.includes('belgica')) return { team: 'Bélgica', flag: '🇧🇪', category: 'europa' };

  if (n.includes('japão') || n.includes('japao')) return { team: 'Japão', flag: '🇯🇵', category: 'asia' };
  if (n.includes('coreia')) return { team: 'Coreia do Sul', flag: '🇰🇷', category: 'asia' };

  if (n.includes('estados unidos')) return { team: 'EUA', flag: '🇺🇸', category: 'america-norte' };
  if (n.includes('méxico') || n.includes('mexico')) return { team: 'México', flag: '🇲🇽', category: 'america-norte' };
  
  if (n.includes('marrocos')) return { team: 'Marrocos', flag: '🇲🇦', category: 'africa' };
  if (n.includes('senegal')) return { team: 'Senegal', flag: '🇸🇳', category: 'africa' };

  return { team: 'Seleção', flag: '🏳️', category: 'outros' };
}

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const containers = html.split('js-item-product');
  
  for (let i = 1; i < containers.length; i++) {
    const container = containers[i];
    
    const nameMatch = container.match(/data-store="product-item-name-[0-9]+">([^<]+)<\/div>/);
    const imgMatch = container.match(/data-srcset="([^ ]+) /) || container.match(/src="([^"]+)"/);
    
    if (nameMatch) {
      let name = nameMatch[1].trim();
      let image = imgMatch ? imgMatch[1] : '';
      if (image && image.startsWith('//')) image = 'https:' + image;
      
      // Fix image quality
      if (image) image = image.replace('-240-0', '-480-0');

      if (!names.has(name)) {
        names.add(name);
        const info = getTeamInfo(name);
        
        let edition = 'Atual';
        if (name.match(/Copa\s+[0-9]+/i)) {
            edition = name.match(/Copa\s+[0-9]+/i)[0];
        } else if (name.match(/[0-9]{4}/)) {
            edition = name.match(/[0-9]{4}/)[0];
        }

        products.push({
          id: currentId++,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: name,
          team: info.team,
          flag: info.flag,
          edition: edition,
          image: image,
          price: 175.90, // We could extract exact price but let's default or extract
          originalPrice: 249.90,
          category: info.category,
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
  }
}

// We also need to extract exact price, let's improve price extraction
for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    // Using the googleItems json to get exact prices
    const jsonMatch = html.match(/const googleItems = (\[.*?\]);/);
    if (jsonMatch) {
        try {
            const items = JSON.parse(jsonMatch[1]);
            for (const item of items) {
                const info = item.info || {};
                const name = info.item_name;
                const price = info.price;
                if (name && price) {
                    const prod = products.find(p => p.name === name);
                    if (prod) {
                        prod.price = parseFloat(price);
                    }
                }
            }
        } catch (e) {}
    }
}

fs.writeFileSync('new_products.json', JSON.stringify(products, null, 2));
console.log(`Extracted ${products.length} products to new_products.json`);
