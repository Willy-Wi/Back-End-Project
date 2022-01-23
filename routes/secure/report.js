const { Router } = require('express');
const router = Router();
const { isLoggedIn } = require("../../controllers/middleware/middleware");
const { createReport } = require("../../controllers/report_feedbackCon");

router.post("/reportuser/:id", isLoggedIn, createReport);
router.post("/reportpost/:id2", isLoggedIn, createReport);

module.exports = router;