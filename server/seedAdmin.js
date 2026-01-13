require("dotenv").config();
const bcrypt = require("bcrypt");
const connectDB = require("./src/config/db");
const User = require("./src/models/User.model");
const ROLES = require("./src/constants/roles");

async function run() {
  await connectDB(process.env.MONGO_URI);

  const email = "admin@cms.com";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("Admin1234", 10);
  await User.create({ fullName: "System Admin", email, passwordHash, role: ROLES.ADMIN });

  console.log("✅ Admin created: admin@cms.com / Admin1234");
  process.exit(0);
}

run();
