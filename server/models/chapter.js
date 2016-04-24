"use strict";

const mongoose = require('mongoose');
const lesson = require('./lesson');

const chapterSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: ''
    },
    number: {
        type: Number,
        required: ''
    },
    xpAwarded: {
        type: Number,
        required: ''
    }
});

module.exports = {
    model: mongoose.model('Chapter', chapterSchema),
    schema: chapterSchema
};
