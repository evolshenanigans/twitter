module.exports = async (req, res) => {
    res.render('dashboard', { user: req.verifiedUser.user,
                            posts: req.posts});
}