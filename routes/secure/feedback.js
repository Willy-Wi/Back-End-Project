const { Router } = require('express');
const router = Router();
const { query } = require('../../controllers/dbCon');
const { isLoggedIn } = require("../../controllers/middleware/middleware");
const { createFeedback } = require("../../controllers/report_feedbackCon");

router.get("/feedback", isLoggedIn, async (req, res) => {
    let sql = `SELECT name, username, user_id, email FROM users WHERE user_id = '${req.session.user.user_id}'`;
    let user = await query(sql);

    res.render("feedback", {
        user: user[0],
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        likes: req.likesInfo,
        id: req.params.id,
    });
});

router.post("/feedback", isLoggedIn, createFeedback);

module.exports = router;