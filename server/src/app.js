const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const timetableRoutes = require("./routes/timetable.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const feeRoutes = require("./routes/fees.routes");
const noticeRoutes = require("./routes/notices.routes");
const marksRoutes = require("./routes/marks.routes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("CMS API running successfully"));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/marks", marksRoutes);


module.exports = app;
