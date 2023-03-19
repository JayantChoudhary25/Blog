const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const Post = require("./models/Post");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookiePaser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const app = express();

const secret = "oidf2j398f23r";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookiePaser());

mongoose.connect(
  "mongodb+srv://blog:hJzQYQlx9tMykN3n@cluster0.qw5eweo.mongodb.net/?retryWrites=true&w=majority"
);

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(8);
  try {
    const user = await User.create({
      username: username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const pass = bcrypt.compareSync(password, user.password);

  if (pass) {
    jwt.sign({ username, id: user._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: user._id,
        username,
      });
    });
  } else {
    res.status(401).json("Wrong Credentials");
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

// Post Upload
app.post("/post", upload.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token , secret , {} , async (err, info)=> {
    if(err) throw err;
  })

  const { title, summary, content } = req.body;
  const post = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
    author: info.id,
  });
  res.json(post);
});

app.get('/post', async (req,res) => {
  res.json(await Post.find());
})

app.listen(4000);
