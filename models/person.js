const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGOURI;

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB:`, error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tel: { type: String, required: true, unique: true },
});

personSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.',
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
