const mongoose = require('mongoose')
const { dbUser, dbPass } = require('./configs.json')

mongoose.set("strictQuery", true);

exports.connect = async () => {
    mongoose
        .connect(`mongodb+srv://${dbUser}:${encodeURIComponent(dbPass)}@botdisc.7sctedu.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
            console.log('MongoDB Conectado')
        })
        .catch((err) => console.log(err))
}