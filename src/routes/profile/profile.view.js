module.exports = async (req, res) => {
    res.render('profile', { user: req.verifiedUser.user,
                            posts: req.verifiedUser.user.posts });
}