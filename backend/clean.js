// Create clean.js in project root
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => console.log('Database cleaned'))
  .catch(console.error)
  .finally(() => process.exit());