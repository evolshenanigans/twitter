const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        },
        quizId: {
            type: String,
            required: true
        }
    },
    { timestamps:true }
)

module.exports = mongoose.model('post',PostSchema)