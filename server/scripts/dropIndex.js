const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/smart_healthcare';

const dropIndex = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const collection = db.collection('users');
        
        // List indexes to verify
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        const emailIndex = indexes.find(i => i.key.email === 1 && i.unique === true && !i.key.role);
        
        if (emailIndex) {
            console.log(`Dropping index: ${emailIndex.name}`);
            await collection.dropIndex(emailIndex.name);
            console.log('Dropped unique email index.');
        } else {
            console.log('No global unique email index found to drop.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error dropping index:', error);
        // Don't fail if index doesn't exist
        process.exit(0);
    }
};

dropIndex();
