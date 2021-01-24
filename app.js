//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "This Journal is designed and developed by RUDRA KARMAKAR with the help of Angela Yu.";
const contactContent = "For more information connect with me on LinkedIn: linkedin.com/in/rudrakarmakar";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("process.env.MONGODB_URI || mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
});


const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      // startingContent: homeStartingContent, 
      posts: posts
    });
  });
});

app.get("/posts/:postId", function(req, res){
  const requestPostId = req.params.postId;
  Post.findOne({_id: requestPostId}, function(err, post){
    res.render("post", {
      title : post.title, 
      content: post.content,
      postDelete: requestPostId
    });
  });
});

app.post("/posts/:postId/delete", function(req, res){
  console.log("Delete request");
  const requestPostId = req.params.postId;
  Post.findOneAndRemove({_id: requestPostId}, function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title : req.body.postTitle,
    content : req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
