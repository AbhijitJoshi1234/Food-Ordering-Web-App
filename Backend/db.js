const mongoose = require('mongoose');
const mongoUrl = 'mongodb+srv://Abhijit_Joshi:qwer%40987@cluster0.f3wyxcx.mongodb.net/GoFood';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');

        const db = mongoose.connection.db;
        const fetched_data = db.collection('food_items');
        const fetched_data_category = db.collection('FoodCategory');
        console.log('Collection fetched:', fetched_data.collectionName);

        const data = await fetched_data.find({}).toArray();
        const catData = await fetched_data_category.find({}).toArray();
        if (catData.length === 0) {
            console.log('No data found in the collection');
        } else {
            global.food_items = data;
            global.FoodCategory = catData;
            // console.log('Fetched data:', global.food_items);
        }
        if (data.length === 0) {
            console.log('No data found in the collection');
        } else {
            global.food_items = data;
            // console.log('Fetched data:', global.food_items);
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = mongoDB;

// const mongoose = require('mongoose')
// // const mongoDbClient = require("mongodb").MongoClient
// const mongoUrl = 'mongodb+srv://Abhijit_Joshi:qwer%40987@cluster0.f3wyxcx.mongodb.net/GoFood';
// // mongodb://<username>:<password>@merncluster-shard-00-00.d1d4z.mongodb.net:27017,merncluster-shard-00-01.d1d4z.mongodb.net:27017,merncluster-shard-00-02.d1d4z.mongodb.net:27017/?ssl=true&replicaSet=atlas-eusy5p-shard-0&authSource=admin&retryWrites=true&w=majority
// module.exports = function (callback) {
//     mongoose.connect(mongoUrl, { useNewUrlParser: true }, async (err, result) => {
//         // mongoDbClient.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
//         if (err) console.log("---" + err)
//         else {
//             // var database =
//             console.log("connected to mongo")
//             const foodCollection = await mongoose.connection.db.collection("food_items");
//             foodCollection.find({}).toArray(async function (err, data) {
//                 const categoryCollection = await mongoose.connection.db.collection("FoodCategory");
//                 categoryCollection.find({}).toArray(async function (err, Catdata) {
//                     callback(err, data, Catdata);

//                 })
//             });
//             // listCollections({name: 'food_items'}).toArray(function (err, database) {
//             // });
//             //     module.exports.Collection = database;
//             // });
//         }
//     })
// };
