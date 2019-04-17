var express = require("express");
var mongoose = require("mongoose")
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res)
{
    axios.get("https://local.theonion.com/").then(function(response){
        var result = {};
        var $ = cheerio.load(response.data);
        $(".post-wrapper").each(function(){
            let  summary = $(this).find(".excerpt p").text();
            if (summary)
            {
                result.headline = $(this).find(".headline a").text();
                result.link = $(this).find(".headline a").attr("href");
                result.summary = summary;
                db.Article.create(result).then(function(created){
                    console.log(created);
                }).catch(function(err){
                    console.log(err);
                })
            }
        })
    })
})
app.get("/articles", function(req, res){
    db.Article.find({}).populate("comment").then(function(data){
        res.json(data);
    }).catch(function(err){
        console.log(err);
    })
});
app.post("/comment/:id", function(req, res){
    db.Comment.create(req.body).then(function(dbComment){
       return db.Article.findOneAndUpdate({_id: req.params.id},{$push:{comment:dbComment._id}}).then(function(dbArticle){
            console.log(dbArticle);
       })
    }).catch(function(err){
        console.log(err);
    })
})
app.listen(PORT, function(){
    console.log("Listenng on port: " + PORT )
})