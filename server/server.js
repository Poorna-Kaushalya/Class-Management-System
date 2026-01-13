require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`)))
  .catch((e) => {
    console.error("DB error:", e);
    process.exit(1);
  });
