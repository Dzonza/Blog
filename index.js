import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
let posts = [];
let messageSuccess;
let messageError;
const quoteList = [
  {
    quote: "What you do after you create your content is what truly counts.",
    author: "Gary Vaynerchuk",
  },
  {
    quote:
      "Don’t focus on having a great blog. Focus on producing a blog that’s great for your readers.",
    author: "Brian Clark",
  },
  {
    quote: "Ideas are easy. Implementation is hard.",
    author: "Guy Kawasaki",
  },
  {
    quote: "If you are going through hell, keep going.",
    author: "Winston Churchill",
  },
  {
    quote:
      "If you can’t explain it simply, you don’t understand it well enough.",
    author: "Albert Einstein",
  },
];
function time() {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const date = new Date();
  return formatter.format(date);
}
app.get("/", (req, res) => {
  const randomQuote = Math.floor(Math.random() * quoteList.length);
  res.render("index.ejs", {
    quoteList: quoteList[randomQuote],
    blogTitle: "Home",
    post: posts,
    messageSuccess: messageSuccess,
    messageError: messageError,
  });
});

app.get("/postDetail/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findPost = posts.find((post) => post.id === id);
  res.render("postDetail.ejs", {
    post: findPost,
    blogTitle: "Post Detail",
  });
});
app.get("/new", (req, res) => {
  res.render("modify.ejs", {
    blogTitle: "Create Post",
    heading: "New Post",
    submit: "Create",
  });
});
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findPost = posts.find((post) => post.id === id);
  res.render("modify.ejs", {
    blogTitle: "Update Post",
    heading: "Edit Post",
    submit: "Update",
    post: findPost,
  });
});
app.post("/posts/createPost", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    author: req.body.author,
    content: req.body.content,
    title: req.body.title,
    date: time(),
  };
  posts.push(newPost);
  messageSuccess = "Post created succesfully";
  res.redirect("/");
});

app.post("/posts/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingPost = posts.find((post) => post.id === id);
  const newPost = {
    id: id,
    title: req.body.title || existingPost.title,
    content: req.body.content || existingPost.content,
    author: req.body.author || existingPost.author,
    date: time(),
  };
  const findIndex = posts.findIndex((post) => post.id === id);
  posts[findIndex] = newPost;
  messageSuccess = "Post updated successfully";
  res.redirect("/");
});

app.post("/deletePost/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findIndex = posts.findIndex((post) => post.id === id);
  if (findIndex > -1) {
    posts.splice(findIndex, 1);
    messageSuccess = "Post deleted successfully";
  } else {
    messageError = `Post with id ${id} wasnt found`;
  }
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`You are on the port ${port}.`);
});
