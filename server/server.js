const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initFirestore } = require("./utils/firestore");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const rootEnvPath = path.resolve(__dirname, "..", ".env");
const serverEnvPath = path.resolve(__dirname, ".env");

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config({ path: serverEnvPath });
}

const authRoutes = require("./routes/authRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const localOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const allowList = [
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.NEXT_PUBLIC_CLIENT_URL ? [process.env.NEXT_PUBLIC_CLIENT_URL] : []),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || localOriginRegex.test(origin) || allowList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "careerpilot-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api", applicationRoutes);
app.use("/api", resumeRoutes);
app.use("/api", aiRoutes);

app.use(notFound);
app.use(errorHandler);

function validateRuntimeConfig() {
  const required = ["JWT_SECRET", "GOOGLE_CLIENT_ID"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`[config] Missing keys: ${missing.join(", ")}. Some features may be degraded.`);
  }
}

async function start() {
  validateRuntimeConfig();
  initFirestore();

  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    console.log(`CareerPilot API running at http://localhost:${port}`);
  });
}

start();
