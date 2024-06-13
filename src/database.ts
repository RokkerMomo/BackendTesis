import mongoose from 'mongoose';
import config from "./config/config";


mongoose.connect(config.DB.URI)




const connection = mongoose.connection;

connection.once('open',()=>{
    console.log('MongoDB Connection stablished')
});

connection.on('error', (err)=>{
    console.log(err)
    process.exit(0);
})