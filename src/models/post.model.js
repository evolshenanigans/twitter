const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    { timestamps:true }
)

module.exports = mongoose.model('post',PostSchema)