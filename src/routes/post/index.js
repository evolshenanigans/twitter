MainPostRouter = require('express').Router()

MainPostRouter.route("/create")
    .post(require("./submit"))

module.exports = MainPostRouter