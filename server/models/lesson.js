/**
 * Created by Razvan on 4/10/2016.
 */
"use strict";

const mongoose = require('mongoose');
const logger = require('log4js').getDefaultLogger();

const lessonSchema = new mongoose.Schema({
    title: String,
    description: String,
    startingContent: String,
    cheats: [{
        section: String,
        shortcut: String,
        description: String,
        keycodes: [Number],
        finished: Boolean
    }],
    completed: Boolean,
    progress: Number,
    type: String
});

module.exports = mongoose.model('Lesson', lessonSchema);