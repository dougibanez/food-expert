export interface Ingredient {
  id: string
  name: string
  unit: string
  pricePerUnit: number
  perPerson?: number
}

export interface Category {
  id: string
  name: string
  emoji: string
  color: string
  ingredients: Ingredient[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'tacos',
    name: 'Tacos',
    emoji: '🌮',
    color: 'amber',
    ingredients: [
      { id: 'taco-1', name: 'Tortillas de maíz', unit: 'pack x30', pricePerUnit: 25, perPerson: 0.3 },
      { id: 'taco-2', name: 'Tortillas de harina', unit: 'pack x20', pricePerUnit: 30, perPerson: 0.3 },
      { id: 'taco-3', name: 'Carne de res (bistec)', unit: 'kg', pricePerUnit: 220, perPerson: 0.2 },
      { id: 'taco-4', name: 'Pollo marinado', unit: 'kg', pricePerUnit: 130, perPerson: 0.2 },
      { id: 'taco-5', name: 'Chorizo', unit: 'kg', pricePerUnit: 160, perPerson: 0.15 },
      { id: 'taco-6', name: 'Al pastor (carne adobada)', unit: 'kg', pricePerUnit: 175, perPerson: 0.2 },
      { id: 'taco-7', name: 'Carnitas', unit: 'kg', pricePerUnit: 200, perPerson: 0.2 },
      { id: 'taco-8', name: 'Cebolla blanca', unit: 'kg', pricePerUnit: 25, perPerson: 0.05 },
      { id: 'taco-9', name: 'Cilantro', unit: 'manojo', pricePerUnit: 10, perPerson: 0.1 },
      { id: 'taco-10', name: 'Limón persa', unit: 'kg', pricePerUnit: 35, perPerson: 0.1 },
      { id: 'taco-11', name: 'Aguacate', unit: 'kg', pricePerUnit: 80, perPerson: 0.1 },
      { id: 'taco-12', name: 'Guacamole preparado', unit: 'kg', pricePerUnit: 120, perPerson: 0.1 },
      { id: 'taco-13', name: 'Salsa verde', unit: 'litro', pricePerUnit: 55, perPerson: 0.05 },
      { id: 'taco-14', name: 'Salsa roja', unit: 'litro', pricePerUnit: 55, perPerson: 0.05 },
      { id: 'taco-15', name: 'Chile de árbol (salsa)', unit: 'litro', pricePerUnit: 60, perPerson: 0.03 },
      { id: 'taco-16', name: 'Queso blanco rallado', unit: 'kg', pricePerUnit: 140, perPerson: 0.05 },
      { id: 'taco-17', name: 'Crema ácida', unit: 'litro', pricePerUnit: 70, perPerson: 0.05 },
      { id: 'taco-18', name: 'Jitomate', unit: 'kg', pricePerUnit: 35, perPerson: 0.05 },
    ],
  },
  {
    id: 'crudos',
    name: 'Crudos & Botana',
    emoji: '🥗',
    color: 'green',
    ingredients: [
      { id: 'crud-1', name: 'Zanahoria baby', unit: 'bolsa 500g', pricePerUnit: 35, perPerson: 0.05 },
      { id: 'crud-2', name: 'Apio', unit: 'manojo', pricePerUnit: 20, perPerson: 0.1 },
      { id: 'crud-3', name: 'Pepino', unit: 'kg', pricePerUnit: 20, perPerson: 0.05 },
      { id: 'crud-4', name: 'Jícama', unit: 'kg', pricePerUnit: 25, perPerson: 0.1 },
      { id: 'crud-5', name: 'Brócoli', unit: 'pieza', pricePerUnit: 30, perPerson: 0.1 },
      { id: 'crud-6', name: 'Coliflor', unit: 'pieza', pricePerUnit: 35, perPerson: 0.1 },
      { id: 'crud-7', name: 'Champiñones frescos', unit: 'kg', pricePerUnit: 80, perPerson: 0.05 },
      { id: 'crud-8', name: 'Pimiento rojo', unit: 'kg', pricePerUnit: 50, perPerson: 0.05 },
      { id: 'crud-9', name: 'Pimiento amarillo', unit: 'kg', pricePerUnit: 55, perPerson: 0.05 },
      { id: 'crud-10', name: 'Dip de queso crema', unit: 'kg', pricePerUnit: 90, perPerson: 0.05 },
      { id: 'crud-11', name: 'Hummus', unit: 'kg', pricePerUnit: 100, perPerson: 0.05 },
      { id: 'crud-12', name: 'Salsa ranch', unit: 'botella 450ml', pricePerUnit: 65, perPerson: 0.05 },
      { id: 'crud-13', name: 'Totopos/Nachos', unit: 'bolsa 500g', pricePerUnit: 40, perPerson: 0.1 },
      { id: 'crud-14', name: 'Papas fritas', unit: 'bolsa 500g', pricePerUnit: 45, perPerson: 0.1 },
      { id: 'crud-15', name: 'Queso manchego rebanado', unit: 'kg', pricePerUnit: 160, perPerson: 0.05 },
      { id: 'crud-16', name: 'Jamón serrano', unit: '100g', pricePerUnit: 45, perPerson: 0.03 },
      { id: 'crud-17', name: 'Aceitunas', unit: 'frasco 250g', pricePerUnit: 55, perPerson: 0.03 },
      { id: 'crud-18', name: 'Galletas saladas', unit: 'caja', pricePerUnit: 30, perPerson: 0.1 },
    ],
  },
  {
    id: 'pizza',
    name: 'Pizza',
    emoji: '🍕',
    color: 'red',
    ingredients: [
      { id: 'pizza-1', name: 'Masa para pizza grande', unit: 'pieza', pricePerUnit: 45, perPerson: 0.15 },
      { id: 'pizza-2', name: 'Masa para pizza individual', unit: 'pieza', pricePerUnit: 20, perPerson: 0.3 },
      { id: 'pizza-3', name: 'Salsa de tomate para pizza', unit: 'kg', pricePerUnit: 30, perPerson: 0.1 },
      { id: 'pizza-4', name: 'Queso mozzarella', unit: 'kg', pricePerUnit: 190, perPerson: 0.15 },
      { id: 'pizza-5', name: 'Queso manchego', unit: 'kg', pricePerUnit: 160, perPerson: 0.1 },
      { id: 'pizza-6', name: 'Pepperoni', unit: '250g', pricePerUnit: 65, perPerson: 0.05 },
      { id: 'pizza-7', name: 'Jamón de pierna', unit: 'kg', pricePerUnit: 130, perPerson: 0.05 },
      { id: 'pizza-8', name: 'Champiñones en conserva', unit: 'lata 400g', pricePerUnit: 40, perPerson: 0.05 },
      { id: 'pizza-9', name: 'Pimiento rojo en tiras', unit: 'kg', pricePerUnit: 50, perPerson: 0.05 },
      { id: 'pizza-10', name: 'Aceitunas negras rebanadas', unit: 'lata 200g', pricePerUnit: 45, perPerson: 0.03 },
      { id: 'pizza-11', name: 'Jitomate cherry', unit: 'kg', pricePerUnit: 60, perPerson: 0.05 },
      { id: 'pizza-12', name: 'Albahaca fresca', unit: 'manojo', pricePerUnit: 25, perPerson: 0.02 },
      { id: 'pizza-13', name: 'Orégano seco', unit: '50g', pricePerUnit: 20, perPerson: 0.01 },
      { id: 'pizza-14', name: 'Aceite de oliva', unit: '500ml', pricePerUnit: 95, perPerson: 0.02 },
      { id: 'pizza-15', name: 'Cebolla morada', unit: 'kg', pricePerUnit: 40, perPerson: 0.05 },
      { id: 'pizza-16', name: 'Jalapeño en conserva', unit: 'frasco 200g', pricePerUnit: 30, perPerson: 0.02 },
      { id: 'pizza-17', name: 'Anchoas', unit: 'lata 50g', pricePerUnit: 40, perPerson: 0.01 },
      { id: 'pizza-18', name: 'Piña en almíbar', unit: 'lata 400g', pricePerUnit: 30, perPerson: 0.05 },
    ],
  },
  {
    id: 'ceviche',
    name: 'Ceviche',
    emoji: '🍋',
    color: 'lime',
    ingredients: [
      { id: 'cev-1', name: 'Camarón fresco (mediano)', unit: 'kg', pricePerUnit: 280, perPerson: 0.2 },
      { id: 'cev-2', name: 'Pescado filete (mahi-mahi)', unit: 'kg', pricePerUnit: 190, perPerson: 0.15 },
      { id: 'cev-3', name: 'Pulpo cocido', unit: 'kg', pricePerUnit: 320, perPerson: 0.1 },
      { id: 'cev-4', name: 'Limón persa', unit: 'kg', pricePerUnit: 35, perPerson: 0.3 },
      { id: 'cev-5', name: 'Naranja agria', unit: 'kg', pricePerUnit: 25, perPerson: 0.1 },
      { id: 'cev-6', name: 'Cebolla morada', unit: 'kg', pricePerUnit: 40, perPerson: 0.05 },
      { id: 'cev-7', name: 'Jitomate bola', unit: 'kg', pricePerUnit: 35, perPerson: 0.1 },
      { id: 'cev-8', name: 'Pepino', unit: 'kg', pricePerUnit: 20, perPerson: 0.05 },
      { id: 'cev-9', name: 'Chile serrano', unit: '100g', pricePerUnit: 15, perPerson: 0.02 },
      { id: 'cev-10', name: 'Cilantro', unit: 'manojo', pricePerUnit: 10, perPerson: 0.1 },
      { id: 'cev-11', name: 'Aguacate', unit: 'kg', pricePerUnit: 80, perPerson: 0.1 },
      { id: 'cev-12', name: 'Clamato', unit: 'litro', pricePerUnit: 55, perPerson: 0.15 },
      { id: 'cev-13', name: 'Salsa Valentina', unit: 'botella 370ml', pricePerUnit: 30, perPerson: 0.05 },
      { id: 'cev-14', name: 'Salsa Tabasco', unit: 'botella 60ml', pricePerUnit: 35, perPerson: 0.02 },
      { id: 'cev-15', name: 'Tostadas', unit: 'pack x30', pricePerUnit: 45, perPerson: 0.3 },
      { id: 'cev-16', name: 'Galletas saladas', unit: 'caja', pricePerUnit: 30, perPerson: 0.1 },
      { id: 'cev-17', name: 'Sal de grano', unit: '1kg', pricePerUnit: 20, perPerson: 0.01 },
      { id: 'cev-18', name: 'Aceite de oliva', unit: '500ml', pricePerUnit: 95, perPerson: 0.01 },
    ],
  },
  {
    id: 'sushi',
    name: 'Sushi',
    emoji: '🍣',
    color: 'pink',
    ingredients: [
      { id: 'sus-1', name: 'Arroz para sushi (Koshihikari)', unit: 'kg', pricePerUnit: 55, perPerson: 0.15 },
      { id: 'sus-2', name: 'Alga nori', unit: 'pack x10 hojas', pricePerUnit: 70, perPerson: 0.15 },
      { id: 'sus-3', name: 'Salmón (sashimi grade)', unit: 'kg', pricePerUnit: 480, perPerson: 0.15 },
      { id: 'sus-4', name: 'Atún (sashimi grade)', unit: 'kg', pricePerUnit: 420, perPerson: 0.1 },
      { id: 'sus-5', name: 'Camarón cocido', unit: 'kg', pricePerUnit: 250, perPerson: 0.1 },
      { id: 'sus-6', name: 'Pepino', unit: 'kg', pricePerUnit: 20, perPerson: 0.05 },
      { id: 'sus-7', name: 'Aguacate', unit: 'kg', pricePerUnit: 80, perPerson: 0.1 },
      { id: 'sus-8', name: 'Queso crema Philadelphia', unit: '190g', pricePerUnit: 55, perPerson: 0.1 },
      { id: 'sus-9', name: 'Mango', unit: 'kg', pricePerUnit: 40, perPerson: 0.05 },
      { id: 'sus-10', name: 'Salsa soya', unit: 'litro', pricePerUnit: 80, perPerson: 0.05 },
      { id: 'sus-11', name: 'Wasabi en pasta', unit: 'tubo 43g', pricePerUnit: 55, perPerson: 0.02 },
      { id: 'sus-12', name: 'Jengibre encurtido (gari)', unit: 'frasco 200g', pricePerUnit: 60, perPerson: 0.02 },
      { id: 'sus-13', name: 'Ajonjolí tostado', unit: '100g', pricePerUnit: 30, perPerson: 0.01 },
      { id: 'sus-14', name: 'Vinagre de arroz', unit: '500ml', pricePerUnit: 55, perPerson: 0.02 },
      { id: 'sus-15', name: 'Azúcar', unit: 'kg', pricePerUnit: 25, perPerson: 0.01 },
      { id: 'sus-16', name: 'Mayonesa japonesa (Kewpie)', unit: '300ml', pricePerUnit: 75, perPerson: 0.03 },
      { id: 'sus-17', name: 'Salsa sriracha', unit: '250ml', pricePerUnit: 55, perPerson: 0.02 },
      { id: 'sus-18', name: 'Estera de bambú para sushi', unit: 'pieza', pricePerUnit: 40, perPerson: 0.05 },
    ],
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    emoji: '🥤',
    color: 'blue',
    ingredients: [
      { id: 'beb-1', name: 'Agua mineral (600ml)', unit: 'caja x24', pricePerUnit: 180, perPerson: 0.1 },
      { id: 'beb-2', name: 'Agua natural (1.5L)', unit: 'caja x12', pricePerUnit: 120, perPerson: 0.15 },
      { id: 'beb-3', name: 'Coca-Cola (2L)', unit: 'botella', pricePerUnit: 35, perPerson: 0.15 },
      { id: 'beb-4', name: 'Pepsi (2L)', unit: 'botella', pricePerUnit: 32, perPerson: 0.1 },
      { id: 'beb-5', name: 'Sprite / 7-Up (2L)', unit: 'botella', pricePerUnit: 32, perPerson: 0.1 },
      { id: 'beb-6', name: 'Jugo de naranja natural', unit: 'litro', pricePerUnit: 40, perPerson: 0.15 },
      { id: 'beb-7', name: 'Jugo de manzana', unit: 'litro', pricePerUnit: 35, perPerson: 0.1 },
      { id: 'beb-8', name: 'Agua de jamaica (preparada)', unit: 'litro', pricePerUnit: 20, perPerson: 0.2 },
      { id: 'beb-9', name: 'Horchata (preparada)', unit: 'litro', pricePerUnit: 25, perPerson: 0.2 },
      { id: 'beb-10', name: 'Agua de limón (preparada)', unit: 'litro', pricePerUnit: 15, perPerson: 0.2 },
      { id: 'beb-11', name: 'Gatorade / Powerade', unit: 'botella 600ml', pricePerUnit: 25, perPerson: 0.1 },
      { id: 'beb-12', name: 'Red Bull / Monster', unit: 'lata 355ml', pricePerUnit: 45, perPerson: 0.05 },
    ],
  },
  {
    id: 'cervezas',
    name: 'Cervezas',
    emoji: '🍺',
    color: 'yellow',
    ingredients: [
      { id: 'cerv-1', name: 'Corona (355ml)', unit: 'caja x24', pricePerUnit: 390, perPerson: 0.15 },
      { id: 'cerv-2', name: 'Modelo Especial (355ml)', unit: 'caja x24', pricePerUnit: 420, perPerson: 0.15 },
      { id: 'cerv-3', name: 'Heineken (355ml)', unit: 'caja x24', pricePerUnit: 480, perPerson: 0.1 },
      { id: 'cerv-4', name: 'Tecate (355ml)', unit: 'caja x24', pricePerUnit: 370, perPerson: 0.15 },
      { id: 'cerv-5', name: 'Sol (355ml)', unit: 'caja x24', pricePerUnit: 380, perPerson: 0.1 },
      { id: 'cerv-6', name: 'Pacífico (355ml)', unit: 'caja x24', pricePerUnit: 400, perPerson: 0.1 },
      { id: 'cerv-7', name: 'XX Lager (355ml)', unit: 'caja x24', pricePerUnit: 380, perPerson: 0.1 },
      { id: 'cerv-8', name: 'Bohemia (355ml)', unit: 'caja x24', pricePerUnit: 430, perPerson: 0.1 },
      { id: 'cerv-9', name: 'Indio (355ml)', unit: 'caja x24', pricePerUnit: 370, perPerson: 0.1 },
      { id: 'cerv-10', name: 'Victoria (355ml)', unit: 'caja x24', pricePerUnit: 370, perPerson: 0.1 },
      { id: 'cerv-11', name: 'Michelada mix', unit: 'litro', pricePerUnit: 55, perPerson: 0.05 },
      { id: 'cerv-12', name: 'Clamato para michelada', unit: 'litro', pricePerUnit: 55, perPerson: 0.05 },
      { id: 'cerv-13', name: 'Sal con chile (Tajín)', unit: '200g', pricePerUnit: 30, perPerson: 0.02 },
      { id: 'cerv-14', name: 'Limones para michelada', unit: 'kg', pricePerUnit: 35, perPerson: 0.1 },
    ],
  },
  {
    id: 'tragos',
    name: 'Tragos',
    emoji: '🍹',
    color: 'purple',
    ingredients: [
      { id: 'trag-1', name: 'Vodka (Smirnoff / Absolut)', unit: '750ml', pricePerUnit: 290, perPerson: 0.05 },
      { id: 'trag-2', name: 'Ron blanco (Bacardí)', unit: '750ml', pricePerUnit: 260, perPerson: 0.05 },
      { id: 'trag-3', name: 'Ron oscuro', unit: '750ml', pricePerUnit: 270, perPerson: 0.03 },
      { id: 'trag-4', name: 'Tequila blanco (Cuervo)', unit: '750ml', pricePerUnit: 230, perPerson: 0.05 },
      { id: 'trag-5', name: 'Tequila reposado (Jimador)', unit: '750ml', pricePerUnit: 280, perPerson: 0.05 },
      { id: 'trag-6', name: 'Mezcal artesanal', unit: '750ml', pricePerUnit: 380, perPerson: 0.03 },
      { id: 'trag-7', name: 'Whisky (Jack Daniel\'s)', unit: '750ml', pricePerUnit: 480, perPerson: 0.03 },
      { id: 'trag-8', name: 'Gin (Bombay Sapphire)', unit: '750ml', pricePerUnit: 430, perPerson: 0.03 },
      { id: 'trag-9', name: 'Cointreau / Triple sec', unit: '750ml', pricePerUnit: 320, perPerson: 0.02 },
      { id: 'trag-10', name: 'Jugo de limón (para cócteles)', unit: 'litro', pricePerUnit: 50, perPerson: 0.05 },
      { id: 'trag-11', name: 'Jugo de naranja', unit: 'litro', pricePerUnit: 40, perPerson: 0.05 },
      { id: 'trag-12', name: 'Jugo de piña', unit: 'litro', pricePerUnit: 45, perPerson: 0.05 },
      { id: 'trag-13', name: 'Agua mineral (para mezclar)', unit: 'caja x24 (600ml)', pricePerUnit: 180, perPerson: 0.05 },
      { id: 'trag-14', name: 'Coca-Cola (para mezclar)', unit: 'caja x24 (355ml)', pricePerUnit: 250, perPerson: 0.05 },
      { id: 'trag-15', name: 'Jarabe simple (azúcar y agua)', unit: 'litro', pricePerUnit: 35, perPerson: 0.03 },
      { id: 'trag-16', name: 'Menta / Hierbabuena fresca', unit: 'manojo', pricePerUnit: 20, perPerson: 0.02 },
      { id: 'trag-17', name: 'Sal gruesa (para margaritas)', unit: '1kg', pricePerUnit: 20, perPerson: 0.01 },
      { id: 'trag-18', name: 'Grenadine / Granada jarabe', unit: '750ml', pricePerUnit: 80, perPerson: 0.02 },
    ],
  },
  {
    id: 'extras',
    name: 'Extras',
    emoji: '📦',
    color: 'slate',
    ingredients: [
      { id: 'ext-1', name: 'Hielo (bolsa 5kg)', unit: 'bolsa', pricePerUnit: 35, perPerson: 0.1 },
      { id: 'ext-2', name: 'Platos desechables', unit: 'pack x50', pricePerUnit: 55, perPerson: 0.02 },
      { id: 'ext-3', name: 'Vasos desechables (250ml)', unit: 'pack x50', pricePerUnit: 45, perPerson: 0.02 },
      { id: 'ext-4', name: 'Cubiertos desechables', unit: 'pack x50 juegos', pricePerUnit: 60, perPerson: 0.02 },
      { id: 'ext-5', name: 'Servilletas', unit: 'pack x100', pricePerUnit: 25, perPerson: 0.01 },
      { id: 'ext-6', name: 'Bolsas para basura (grandes)', unit: 'pack x10', pricePerUnit: 30, perPerson: 0.01 },
      { id: 'ext-7', name: 'Papel aluminio', unit: 'rollo 7.5m', pricePerUnit: 35, perPerson: 0.01 },
      { id: 'ext-8', name: 'Papel film (plástico)', unit: 'rollo 30m', pricePerUnit: 45, perPerson: 0.01 },
      { id: 'ext-9', name: 'Palillos de dientes', unit: 'caja x200', pricePerUnit: 20, perPerson: 0.005 },
      { id: 'ext-10', name: 'Carbón (para asador)', unit: 'bolsa 4kg', pricePerUnit: 80, perPerson: 0.05 },
      { id: 'ext-11', name: 'Encendedor / Cerillos', unit: 'pieza', pricePerUnit: 15, perPerson: 0.01 },
      { id: 'ext-12', name: 'Hielera / Cooler', unit: 'pieza', pricePerUnit: 280, perPerson: 0.01 },
      { id: 'ext-13', name: 'Palitos para brocheta', unit: 'pack x100', pricePerUnit: 25, perPerson: 0.01 },
      { id: 'ext-14', name: 'Copas desechables para vino', unit: 'pack x12', pricePerUnit: 55, perPerson: 0.01 },
    ],
  },
]

export interface SearchResult extends Ingredient {
  categoryId: string
  categoryName: string
  categoryEmoji: string
}

export function searchIngredients(query: string): SearchResult[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const results: SearchResult[] = []

  for (const category of CATEGORIES) {
    for (const ingredient of category.ingredients) {
      if (ingredient.name.toLowerCase().includes(q)) {
        results.push({
          ...ingredient,
          categoryId: category.id,
          categoryName: category.name,
          categoryEmoji: category.emoji,
        })
      }
    }
  }

  return results.slice(0, 20)
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

export function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
