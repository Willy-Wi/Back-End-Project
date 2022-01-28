const express = require("express");
const session = require("express-session");
const { conn } = require("./controllers/dbCon");
const upload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const auth = require("./routes/auth/auth");
const index = require("./routes/index");
const comment = require("./routes/secure/posts/comments/comment");
const posts = require("./routes/secure/posts/post");
const postsOther = require("./routes/secure/posts/postPages");
const users = require("./routes/secure/users/users");
const files = require("./routes/secure/files");

const app = express();
const PORT = 3000;

conn.connect((err) => {
    if (err) throw err;
    console.log("MySQL WorkBench is connected");
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(
    session({
        secret: "Secret Key",
        path: "/",
        cookie: { maxAge: 60 * 60 * 1000 },
        resave: false,
        saveUninitialized: false,
    })
);
app.use(upload());

app.use("/auth/", auth);
app.use("/users/", users);
app.use("/comment", comment);
app.use("/posts/", posts);
app.use("/", index);
app.use("/", postsOther);
app.use("/", files);

// If page does not exist
app.use((req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
