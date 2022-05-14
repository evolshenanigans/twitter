const axios = require('axios')

module.exports = async (req, res) => {
    
    

    const mutation = `
    mutation createPost($text: String, $userId: String, $photo: String){
        createPost(text: $text, userId: $userId, photo: $photo)
        }`

    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
            { 
                query: mutation,
                variables: {
                    text: req.body.text,
                    userId: req.verifiedUser.user._id,
                    photo: ''
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });   
            console.log(data)
            console.log({
                text: req.body.text,
                userId: req.verifiedUser.user._id,
                photo
            })
    } catch(e) {
        console.log(e)
    }   

    res.redirect(`/`)
}