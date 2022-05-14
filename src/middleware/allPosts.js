const axios = require('axios')
const { GraphQLID } =require('graphql')

const allPosts = async (req, res, next) =>{
    if (!req.verifiedUser){
        next()
        return
    }
    const query = `
        query posts {
            posts {
                id,
                text,
                photo,
                userId,
                createdDate
                user{
                    id,
                    username
                }
            }
        }`
    let data = {}
    try {
        data = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {query},
            {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
    } catch(e){
        console.log(e)
        // console.log(e.response.data.errors.message)
    
    }

    req.posts = data.data.data.posts ?? []
    console.log(req.posts)
    next()
}

module.exports = { allPosts }