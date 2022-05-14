MainProfileRouter = require("express").Router()

MainProfileRouter.route("/profile")
    .get(require("./profile.view.js"))
    



module.exports = MainProfileRouter