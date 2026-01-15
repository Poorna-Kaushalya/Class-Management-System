const Fee = require("../models/ClassFee.model");
const Attendance = require("../models/Attendance.model");
const User = require("../models/User.model");

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const pad2 = (n) => String(n).padStart(2, "0");
const monthKey = (year, m) => `${year}-${pad2(m)}`;

async function upsertFee(req, res) {
  try {
    const { studentId, month, paidDate, amount, note } = req.body;

    if (!studentId || !month) {
      return res.status(400).json({ message: "studentId and month are required" });
    }

    const attendanceCount = await Attendance.countDocuments({
      studentId,
      date: { $regex: `^${month}` },
    });

    let status = "ABSENT";
    if (attendanceCount > 0) status = paidDate ? "PAID" : "PENDING";

    const record = await Fee.findOneAndUpdate(
      { studentId, month },
      {
        studentId,
        month,
        amount: amount ?? 1000,
        paidDate: paidDate ?? "",
        note: note ?? "",
        status,
      },
      { upsert: true, new: true }
    );

    return res.json({ message: "Fee saved", record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Fee save failed" });
  }
}

async function getMyFeesByYear(req, res) {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: "year is required (YYYY)" });

    // ✅ Always get studentId from DB
    const user = await User.findById(req.user.id).select("studentId");
    if (!user || !user.studentId) {
      return res.status(401).json({ message: "Student ID not found" });
    }

    const studentId = user.studentId;

    const existing = await Fee.find({
      studentId,
      month: { $regex: `^${year}-` },
    }).sort({ month: 1 });

    const feeMap = {};
    existing.forEach((r) => (feeMap[r.month] = r));

    const attendance = await Attendance.find({
      studentId,
      date: { $regex: `^${year}-` },
    }).select("date");

    const attendedMonths = new Set(
      attendance.map((a) => a.date.slice(0, 7))
    );

    const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
    const pad2 = (n) => String(n).padStart(2, "0");

    const records = MONTHS.map((m) => {
      const mk = `${year}-${pad2(m)}`;

      if (feeMap[mk]) return feeMap[mk];

      return {
        studentId,
        month: mk,
        amount: 1000,
        paidDate: "",
        note: "",
        status: attendedMonths.has(mk) ? "PENDING" : "ABSENT",
        createdAt: "",
      };
    });

    return res.json({ year, records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Fee load failed" });
  }
}


module.exports = { upsertFee, getMyFeesByYear };
