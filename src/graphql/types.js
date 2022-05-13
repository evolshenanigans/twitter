const { GraphQLObjectType, GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql')

const { User, Quiz, Post, Submission } = require('../models');

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User type',
    fields: ()=> ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        quizzes: {
            type: new GraphQLList(QuizType),
            resolve(parent, args) {
                return Quiz.find({ userID : parent.id })
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parent, args) {
                return Submission.find({ userID : parent.id })
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post type',
    fields: () =>({
        id: {type: GraphQLID},
        title: { type: GraphQLString},
        correctAnswer: { type: GraphQLString},
        quizId: { type: GraphQLString},
        order: { type: GraphQLInt},
        quiz: {
            type: QuizType,
            resolve(parent,args) {
                return User.findById(parent.quizId)
            }
        }
    })
})

const PostInputType  = new GraphQLInputObjectType({
    name: 'PostInput',
    description: 'Post input type',
    fields: () => ({
        title: { type: GraphQLString },
        order: { type: GraphQLID },
        correctAnswer: { type: GraphQLString },

    })
})


const AnswerInputType  = new GraphQLInputObjectType({
    name: 'AnswerInput',
    description: 'Answer input type',
    fields: () => ({
        PostId: { type: GraphQLString },
        answer: { type: GraphQLString },

    })
})

const QuizType = new GraphQLObjectType({
    name: 'Quiz',
    description: 'Quiz type',
    fields: ()=>({
        id: {type: GraphQLID },
        slug: {type: GraphQLString },
        title: {type: GraphQLString },
        description: {type: GraphQLString },
        userId: {type: GraphQLString },
        user: {
            type: UserType,
            resolve( parent, args ) {
                return User.findById(parent.userId)
            }
        },
        Posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({quizId: parent.id})
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parent, args) {
                return Submission.find({quizId: parent.id})
            }
        },
        avgScore: {
            type : GraphQLFloat,
            async resolve(parent, args) {
                const submissions = await Submission.find({ quizId: parent.id })
                let score = 0;

                console.log(submissions)
                for (const submission of submissions) {
                    score += submission.score
                }

                return (score / submissions.length) || 0
            }
            
        }
    })
})


const SubmissionType = new GraphQLObjectType({
    name: 'Submission',
    description: 'Submission type',
    fields: ()=>({
        id: { type:GraphQLID },
        quizId: { type:GraphQLString },
        userId: { type:GraphQLString },
        score: { type:GraphQLInt },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        },
        quiz: {
            type: QuizType,
            resolve(parent, args) {
                return Quiz.findById(parent.quizId)
            }
        },
    })
})

module.exports = {
    UserType,
    QuizType,
    PostType,
    PostInputType,
    AnswerInputType,
    SubmissionType
}