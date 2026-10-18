const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`

export const initialProducts = [
  { id: 1, name: 'Chicken Rice Meal', description: 'Grilled chicken, steamed rice, and house sauce.', price: 85, category: 'Meals', image: image('photo-1532550907401-a500c9a57435'), available: true },
  { id: 2, name: 'Campus Burger', description: 'Beef patty, lettuce, tomato, cheese, and special sauce.', price: 65, category: 'Snacks', image: image('photo-1568901346375-23c9450c58cd'), available: true },
  { id: 3, name: 'Iced Coffee', description: 'Cold brewed coffee with creamy milk and ice.', price: 45, category: 'Drinks', image: image('photo-1461023058943-07fcbe16d735'), available: true },
  { id: 4, name: 'Pancake Stack', description: 'Soft pancakes served with syrup and butter.', price: 60, category: 'Breakfast', image: image('photo-1528207776546-365bb710ee93'), available: true },
  { id: 5, name: 'Spaghetti Meal', description: 'Sweet-style spaghetti with cheese and savory sauce.', price: 75, category: 'Meals', image: image('photo-1551892374-ecf8754cf8b0'), available: true },
  { id: 6, name: 'French Fries', description: 'Crispy golden fries with a light seasoning.', price: 40, category: 'Snacks', image: image('photo-1573080496219-bb080dd4f877'), available: true },
  { id: 7, name: 'Fruit Tea', description: 'Refreshing iced tea with fruit flavors.', price: 50, category: 'Drinks', image: image('photo-1556679343-c7306c1976bc'), available: true },
  { id: 8, name: 'Chocolate Brownie', description: 'Rich chocolate brownie with a soft center.', price: 45, category: 'Desserts', image: image('photo-1606313564200-e75d5e30476c'), available: true },
  { id: 9, name: 'Veggie Wrap', description: 'A healthy wrap filled with fresh vegetables and hummus.', price: 55, category: 'Meals', image: image('photo-1626700051175-6818013e1d4f'), available: true },
  { id: 10, name: 'Grilled Cheese Sandwich', description: 'Toasted sandwich with melted cheese and a side of chips.', price: 50, category: 'Snacks', image: image('photo-1528735602780-2552fd46c7af'), available: true },
  { id: 11, name: 'Lemonade', description: 'Fresh lemonade with a hint of mint.', price: 35, category: 'Drinks', image: image('photo-1513558161293-cdaf765edfd7'), available: true },
  { id: 12, name: 'Caesar Salad', description: 'Crisp greens with Caesar dressing and croutons.', price: 60, category: 'Meals', image: image('photo-1546793665-c74683f339c1'), available: true },
  { id: 13, name: 'Mango Smoothie', description: 'Creamy mango smoothie made with fresh mangoes.', price: 55, category: 'Drinks', image: image('photo-1505252585461-04db1eb84625'), available: true },
  { id: 14, name: 'Sinigang na Baboy', description: 'Traditional Filipino sour soup with pork and vegetables.', price: 80, category: 'Meals', image: image('photo-1547592180-85f173990554'), available: true },
  { id: 15, name: 'Halo-Halo', description: 'Filipino dessert with crushed ice, sweet beans, fruits, and milk.', price: 70, category: 'Desserts', image: image('photo-1488477181946-6428a0291777'), available: true },
  { id: 16, name: 'Mango Float', description: 'Creamy mango dessert, served chilled.', price: 65, category: 'Desserts', image: image('photo-1563805042-7684c019e1cb'), available: true },
  { id: 17, name: 'Iced Matcha Latte', description: 'Chilled matcha latte made with green tea powder and milk.', price: 60, category: 'Drinks', image: image('photo-1515823064-d6e0c04616a7'), available: true },
]
