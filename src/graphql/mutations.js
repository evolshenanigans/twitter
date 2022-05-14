const { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInt } = require('graphql')
const { PostInputType, AnswerInputType } = require('./types')
const { User, Post } = require('../models')
const { createJwtToken } = require('../util/auth')


const register = {
    type: GraphQLString,
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        const checkUser = await User.findOne( { email: args.email })
        if (checkUser) {
            throw new Error('User with this email already exists.')
        }
        const { username, email, password } = args
        const user = new User({username, email, password })

        await user.save()
        
        const token = createJwtToken(user)
        return token
    }
}

const login = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const user = await User.findOne({ email: args.email })
        if (!user || args.password !== user.password) {
            throw new Error("Invalid credentials")
        }

        const token = createJwtToken(user)
        return token
    }
}

const createPost = {
    type: GraphQLString,
    args : {
        text: {type: GraphQLString},
        photo: {type: GraphQLString},
        userId: {type: GraphQLString}
    },
    async resolve(parent, args) {
        const post = new Post({
            text: args.text,
            photo: args.photo,
            userId: args.userId,
            createdDate: (new Date()).toString()
        })
        await post.save()
        return post.id
    }
}

module.exports = {register, login, createPost}