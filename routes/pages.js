const { Router } = require("express");
const { check } = require("express-validator");
const { mainPage } = require("./mainPage");
const { register, login } = require("../controllers/authCon");
const { searchData } = require("../controllers/searchCon");
const { postCreate, postLike } = require("../controllers/postCon");

const router = Router();

// * Renders
router.get("/", mainPage);

router.get("/create", (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect("/login");
    }
    res.render("create_post", { loggedIn: req.session.loggedIn });
});

router.get("/register", (req, res) => {
    if (!req.session.loggedIn) {
        return res.render("register");
    }
    return res.redirect("/");
});

router.get("/login", (req, res) => {
    if (!req.session.loggedIn) {
        return res.render("login");
    }
    return res.redirect("/");
});

router.get("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
        return res.redirect("/");
    }
    res.redirect("/login");
});

// * Validation Functions
const validationRegister = [
    check("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    check("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters"),
    check("email").isEmail().withMessage("Please enter an email"),
];

const validatePost = [
    check("post_message")
        .isLength({ min: 1, max: 1000 })
        .withMessage(
            "Character must be at least 10 with a limit of 510 characters"
        ),
];

// * Controller Files
router.get("/search", searchData); // Search Data = User OR Post
router.post("/create", validatePost, postCreate);
router.post("/register", validationRegister, register);
router.post("/login", login);
router.post("/posts/:id/act", postLike);

module.exports = router;
