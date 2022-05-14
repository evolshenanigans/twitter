const { GraphQLList, GraphQLID, GraphQLString } = require('graphql')
const { UserType, PostType } = require('./types')
const { User, Post } = require('../models')

const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users in the database',
    resolve(parent, args) {
        return User.find()
    }
}

const user = {
    type: UserType,
    description: 'Query user by id',
    args: {
        id: {type: GraphQLID}
    },
    resolve(parent, args) {
        return User.findById(args.id)
    }
}
const post = {
    type: PostType,
    description: 'Query post by id',
    args: {
        id: {type: GraphQLID}
    },
    resolve(parent, args) {
        return Post.findById(args.id)
    }
}
const posts = {
    type: new GraphQLList(PostType),
    description: 'Query all posts by all users',
    resolve(parent, args) {
        return Post.find()
    }
}



module.exports = {users, user, post, posts}