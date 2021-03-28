const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Images = new Schema(
    {
        user: {type: Number, required: true},
        file_path: {type: String, required: true}
    }
);

Images.set('toObject', {getters: true});

module.exports = mongoose.model('Image', Images);
