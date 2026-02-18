require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(express.json());

// Allow Codespaces + localhost
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok =
        origin.includes("localhost:3000") ||
        origin.endsWith(".app.github.dev");
      return ok ? cb(null, true) : cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, firstName: user.firstName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// -------- AUTH --------
app.post("/auth/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    addressLine1,
    city,
    province,
    postalCode,
    country,
  } = req.body || {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      addressLine1: addressLine1 || null,
      city: city || null,
      province: province || null,
      postalCode: postalCode || null,
      country: country || "Canada",
    },
  });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, firstName: user.firstName, email: user.email },
  });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Missing email/password" });

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, firstName: user.firstName, email: user.email },
  });
});

app.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

// -------- PRODUCTS --------
app.get("/products", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const colour = (req.query.colour || "").toString().trim();

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        colour && colour !== "Any" ? { colour } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
