const mongoose = require("mongoose");
require("dotenv").config();

// Import model (FIX PATH if needed)
const Subject = require("../models/Subject.model");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

const subjects = [
  {
    name: "Mathematics",
    teacher: "Mr. Silva",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "A/L"],
    colors: {
      light: "bg-blue-200 text-blue-700",
      main: "bg-blue-500 text-white",
      dark: "bg-blue-600 text-white",
    },
  },
  {
    name: "Science",
    teacher: "Mrs. Perera",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "A/L"],
    colors: {
      light: "bg-green-200 text-green-700",
      main: "bg-green-500 text-white",
      dark: "bg-green-600 text-white",
    },
  },
  {
    name: "English",
    teacher: "Miss Fernando",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "A/L"],
    colors: {
      light: "bg-purple-200 text-purple-700",
      main: "bg-purple-500 text-white",
      dark: "bg-purple-600 text-white",
    },
  },
  {
    name: "History",
    teacher: "Mr. Jayasinghe",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"],
    colors: {
      light: "bg-amber-200 text-amber-700",
      main: "bg-amber-500 text-white",
      dark: "bg-amber-600 text-white",
    },
  },
  {
    name: "Geography",
    teacher: "Mrs. Kumari",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"],
    colors: {
      light: "bg-cyan-200 text-cyan-700",
      main: "bg-cyan-500 text-white",
      dark: "bg-cyan-600 text-white",
    },
  },
  {
    name: "ICT",
    teacher: "Mr. Nuwan",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "A/L"],
    colors: {
      light: "bg-indigo-200 text-indigo-700",
      main: "bg-indigo-500 text-white",
      dark: "bg-indigo-600 text-white",
    },
  },
  {
    name: "Commerce",
    teacher: "Mrs. Dilani",
    grades: ["Grade 9", "Grade 10", "Grade 11", "A/L"],
    colors: {
      light: "bg-pink-200 text-pink-700",
      main: "bg-pink-500 text-white",
      dark: "bg-pink-600 text-white",
    },
  },
  {
    name: "Civics",
    teacher: "Mr. Bandara",
    grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"],
    colors: {
      light: "bg-slate-200 text-slate-700",
      main: "bg-slate-500 text-white",
      dark: "bg-slate-600 text-white",
    },
  },
];

async function seedSubjects() {
  try {
    // Optional: Clear existing data
    await Subject.deleteMany();

    // Insert new subjects
    await Subject.insertMany(subjects);

    console.log(" Subjects Seeded Successfully");
    process.exit();
  } catch (err) {
    console.error(" Seeding Failed:", err);
    process.exit(1);
  }
}

seedSubjects();