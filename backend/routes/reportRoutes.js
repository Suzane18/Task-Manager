const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport);  //export tasks as pdf or excel
router.get("/export/users",protect,adminOnly,exportUsersReport);  //export users as pdf or excel

module.exports = router;
