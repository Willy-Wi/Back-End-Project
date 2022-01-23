const { Router } = require("express");
const router = Router();
const { isNotLoggedIn } = require("../../controllers/middleware/middleware");
const {
    register,
    login,
    forgot,
    change,
} = require("../../controllers/authCon");

router.get("/register", isNotLoggedIn, (req, res) => {
    res.render("register", {
        isLoggedIn: req.session.isLoggedIn || false,
    });
});

router.get("/login", isNotLoggedIn, (req, res) => {
    res.render("login", {
        isLoggedIn: req.session.isLoggedIn || false,
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.get("/forgot-password", isNotLoggedIn, (req, res) => {
    res.render("profile/forgot-password", {
        isLoggedIn: req.session.isLoggedIn || false,
    });
});

router.post("/register", isNotLoggedIn, register);
router.post("/login", isNotLoggedIn, login);

router.post("/forgot-password", isNotLoggedIn, forgot);
router.post("/change-password", change);

module.exports = router;
