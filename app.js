const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://shweta:prajakta@cluster0.lwkxm.mongodb.net/blogDB", {useNewUrlParser:true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("post", postSchema);

const homeStartingContent = "Have an interesting idea? Tries a new receipe? Learned a new word? Loved any movie? Whatever it is! Write it down in your own blog."

const aboutContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

app.get("/", function(req, res){
  Post.find({}, function(err, result){
    res.render("home", {homeStartingContent: homeStartingContent, posts: result});
  })
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res){
  const requestedPost = req.params.postId;

  Post.findOne({_id: requestedPost}, function(err, foundPost){
    if(!err){
      res.render("post", {post:foundPost});
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
})

app.listen(3000, function(){
  console.log("Server started");
});
