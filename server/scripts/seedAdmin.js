const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techforge');
    await Admin.deleteMany({ email: 'admin@techforge.com' });
    const admin = new Admin({
      email: 'admin@techforge.com',
      password: 'password123'
    });
    await admin.save();
    console.log('Admin user seeded: admin@techforge.com / password123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
seedAdmin();