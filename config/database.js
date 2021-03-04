import mongoose from 'mongoose';
import dotenv from 'dotenv';

// read the configuration file
dotenv.config();
const host = encodeURIComponent(process.env.MONGO_DB_HOST);
const port = encodeURIComponent(process.env.MONGO_DB_PORT);
const database = encodeURIComponent(process.env.MONGO_DB_DATABASE);
const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);

const dbString = 'mongodb://'+username+':'+password+'@'+host+':'+port+'/'+database+'?authSource='+database;
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(dbString, dbOptions);

mongoose.connection.on('connected', () => {
    console.log('Database connected');
});
