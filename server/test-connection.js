const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('📍 Your IP:', '103.213.211.203');
console.log('🔗 Connection String:', process.env.MONGODB_URI ? 'Found in .env' : 'Missing in .env');

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🏠 Host:', mongoose.connection.host);
  
  // Test creating a simple document
  const testSchema = new mongoose.Schema({ test: String });
  const TestModel = mongoose.model('Test', testSchema);
  
  return TestModel.create({ test: 'Connection successful!' });
})
.then((doc) => {
  console.log('✅ SUCCESS: Created test document:', doc._id);
  console.log('🎉 MongoDB is fully working!');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ FAILED: MongoDB connection error:');
  console.log('📝 Error type:', error.constructor.name);
  console.log('💬 Error message:', error.message);
  
  if (error.message.includes('IP')) {
    console.log('\n🔧 SOLUTION:');
    console.log('1. Go to MongoDB Atlas → Network Access');
    console.log('2. Add IP: 103.213.211.203');
    console.log('3. Or use 0.0.0.0/0 for all IPs (development only)');
  }
  
  if (error.message.includes('authentication')) {
    console.log('\n🔧 SOLUTION:');
    console.log('1. Check your username/password in connection string');
    console.log('2. Go to Database Access → Check user permissions');
  }
  
  process.exit(1);
});
