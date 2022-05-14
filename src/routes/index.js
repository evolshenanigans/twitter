module.exports = (app) => {
    app.use("/auth", require("./auth"))
    app.use("/", require("./dashboard")) 
    app.use("/post", require("./post"))
    app.use("/profile", require("./profile"))
   
}