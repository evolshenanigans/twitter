const { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInt } = require('graphql')
const { PostInputType, AnswerInputType } = require('./types')
const { User, Quiz, Post, Submission } = require('../models')
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

const createQuiz = {
    type: GraphQLString,
    args: {
        Post: { 
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostInputType)))
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        userId: {
            type: GraphQLString
        }
    },
    async resolve(parent, args) {
        /* Generate slug version of quiz for url */
        let slugify = args.title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        let fullSlug = ''

        /* Add a random integer to the end of the slug, check that slug doesn't already exist.
        *  If it does exist, generate new slug. Else continue.
        */
        while (true) {
            let slugId = Math.floor(Math.random()*10000)
            fullSlug = `${slugify}-${slugId}`

            const existingQuiz = await Quiz.findOne({ slug: fullSlug })
            
            if (!existingQuiz)
                break;
        }

        const quiz = new Quiz({
            title: args.title,
            slug: fullSlug,
            description: args.description,
            userId: args.userId
        })

        await quiz.save()

        /* Create post types and connect to new quiz */
        for (const post of args.Posts) {
            const PostItem = new Post({
                title: post.title,
                correctAnswer: post.correctAnswer,
                order: new Number(post.order),
                quizId: quiz.id
            })
            PostItem.save()
        }

        return quiz.slug
    }
}

const submitQuiz = {
    type: GraphQLString,
    args: {
        answers: { 
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerInputType)))
        },
        userId: {
            type: GraphQLString
        },
        quizId: {
            type: GraphQLString
        }
    },
    async resolve(parent, args) {
        try{
        let correct = 0
        let totalScore = args.answers.length

        for (const answer of args.answers) {
            const PostAnswer = await Post.findById(answer.PostId)

            if (answer.answer.trim().toLowerCase() === PostAnswer.correctAnswer.trim().toLowerCase()) {
                correct++
            }
        }

        const score = (correct / totalScore) * 100

        const submission = new Submission({
            userId: args.userId,
            quizId: args.quizId,
            score
        })

        submission.save()

            return submission.id
        }
        catch(e) {
            console.log(e)
            return ''
        }
    }
}

module.exports = { register, login, createQuiz, submitQuiz }