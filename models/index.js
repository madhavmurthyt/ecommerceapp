import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5434,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false, // Set to console.log for debugging
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

// Import models
import UserModel from './user.js';
import CategoryModel from './category.js';
import ProductModel from './product.js';
import CartModel from './cart.js';
import CartItemModel from './cartItem.js';
import OrderModel from './order.js';
import OrderItemModel from './orderItem.js';
import PaymentModel from './payment.js';

const User = UserModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const Cart = CartModel(sequelize, DataTypes);
const CartItem = CartItemModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderItem = OrderItemModel(sequelize, DataTypes);
const Payment = PaymentModel(sequelize, DataTypes);

// Define associations
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'RESTRICT' });

Order.hasOne(Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// Export models and sequelize instance
export  {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
};