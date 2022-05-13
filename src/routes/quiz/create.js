const axios = require('axios')
const e = require('express')

module.exports = async (req, res) => {
    const quizInputs = req.body
    
    const quizData = {
        userId: req.verifiedUser.user._id,
        title: quizInputs['quizTitle'],
        description: quizInputs['quizDescription'],
        Posts: []
    }

    for (const key in quizInputs) {
        if (key.includes('PostTitle')) {
            const PostNum = parseInt(key.split('PostTitle')[1])
            
            /* If quizData post doesn't exist, add new Posts until it does */
            while(!quizData.Posts[PostNum]) {
                quizData.Posts.push({})
            }
            quizData.Posts[PostNum].title = quizInputs[key]
        } else if (key.includes('PostAnswer')) {
            const PostNum = parseInt(key.split('PostAnswer')[1])
            quizData.Posts[PostNum].correctAnswer = quizInputs[key]
            quizData.Posts[PostNum].order = PostNum + 1
        }
    }

    const mutation = `
        mutation createQuiz($userId: String!, $title: String!, $description: String!, $Posts: [PostInput!]!) { 
            createQuiz( userId: $userId, title: $title, description: $description, Posts: $Posts )
        }`

    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
            { 
                query: mutation,
                variables: quizData
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });   
        console.log(data)
        quizSlug = data.data.createQuiz
    } catch(e) {
        console.log(e)
    }   

    res.redirect(`/quiz/success/${quizSlug}`)
}