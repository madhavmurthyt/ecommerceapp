import { hash } from 'bcryptjs';
import { sequelize, Category, Product, User } from './models/index.js';

async function initDB() {
  try {
    // Drop and recreate all tables
    await sequelize.sync({ force: true });


    const defaultUsers = [
      { firstName: 'Madhav', lastName: 'Thotapalli', email: 'madhav@gmail.com', password: await hash('password123', 10) },
      { firstName: 'Test', lastName: 'test', email: 'test@gmail.com', password: await hash('password123', 10) }
    ];
    await User.bulkCreate(defaultUsers);

    // Insert default categories
    const defaultCategories = [
      { name: 'Electronics', description: 'Devices and gadgets' },
      { name: 'Books', description: 'Printed and digital books' },
      { name: 'Clothing', description: 'Apparel for men and women' },
      { name: 'Home & Kitchen', description: 'Home appliances and kitchenware' },
    ];

    // bulkCreate is fine here because the tables were just recreated
    const createdCategories = await Category.bulkCreate(defaultCategories);

     // Build a map from category name -> id
    const categoryMap = new Map();
    createdCategories.forEach(cat => categoryMap.set(cat.name, cat.id));

    // Example default products referencing the actual category IDs
    const defaultProducts = [
      {
        name: 'Wireless Headphones',
        description: 'Bluetooth over-ear headphones with active noise cancellation.',
        price: 99.99,
        stockQuantity: 150,
        categoryId: categoryMap.get('Electronics'),
        imageUrl: 'https://example.com/images/headphones.jpg'
      },
      {
        name: 'Smartphone Stand',
        description: 'Adjustable aluminum stand for phones and small tablets.',
        price: 19.99,
        stockQuantity: 300,
        categoryId: categoryMap.get('Electronics'),
        imageUrl: 'https://example.com/images/stand.jpg'
      },
      {
        name: 'Modern JavaScript Book',
        description: 'Comprehensive guide to modern JavaScript and best practices.',
        price: 34.5,
        stockQuantity: 200,
        categoryId: categoryMap.get('Books'),
        imageUrl: 'https://example.com/images/js-book.jpg'
      },
      {
        name: 'Travel Backpack',
        description: 'Durable water-resistant backpack with laptop compartment.',
        price: 79.99,
        stockQuantity: 120,
        categoryId: categoryMap.get('Clothing'),
        imageUrl: 'https://example.com/images/backpack.jpg'
      },
      {
        name: 'Cotton T-Shirt',
        description: '100% cotton unisex t-shirt, available in multiple sizes.',
        price: 14.99,
        stockQuantity: 500,
        categoryId: categoryMap.get('Clothing'),
        imageUrl: 'https://example.com/images/tshirt.jpg'
      },
      {
        name: 'Ceramic Coffee Mug',
        description: '12oz ceramic mug, dishwasher safe.',
        price: 9.5,
        stockQuantity: 400,
        categoryId: categoryMap.get('Home & Kitchen'),
        imageUrl: 'https://example.com/images/mug.jpg'
      },
      {
        name: 'Blender 600W',
        description: 'Compact blender for smoothies and shakes.',
        price: 49.99,
        stockQuantity: 80,
        categoryId: categoryMap.get('Home & Kitchen'),
        imageUrl: 'https://example.com/images/blender.jpg'
      },
      {
        name: 'Laptop Sleeve 13 inch',
        description: 'Neoprene sleeve with zipper and soft lining.',
        price: 21.0,
        stockQuantity: 220,
        categoryId: categoryMap.get('Electronics'),
        imageUrl: 'https://example.com/images/laptop-sleeve.jpg'
      },
      {
        name: 'E-reader',
        description: 'Lightweight e-reader with adjustable front light.',
        price: 119.99,
        stockQuantity: 90,
        categoryId: categoryMap.get('Books'),
        imageUrl: 'https://example.com/images/ereader.jpg'
      },
      {
        name: 'Kitchen Knife Set',
        description: 'Stainless steel 5-piece knife set with block.',
        price: 59.99,
        stockQuantity: 60,
        categoryId: categoryMap.get('Home & Kitchen'),
        imageUrl: 'https://example.com/images/knifeset.jpg'
      }
    ];

    // Insert products using the real category IDs
    await Product.bulkCreate(defaultProducts);


    console.log('Database tables recreated successfully');
  } catch (error) {
    console.error('Error recreating database tables:', error);
    throw error;
  }
}

export default initDB;
