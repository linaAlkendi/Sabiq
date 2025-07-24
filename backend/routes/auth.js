const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");

// مفتاح التشفير الخاص بـ JWT 
const JWT_SECRET = "سري_جدا_لا_تشارك_مع_أحد";

function getAllUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveAllUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// Original plain passwords
const plainPasswords = {
  tech_user1: "Tech@123",
  supervisor1: "no",
  ops_manager: "Ops@789",
};

// دالة تشفير كلمات المرور عند بداية تشغيل السيرفر
async function hashPasswords() {
  let users = getAllUsers();
  let modified = false;

  for (let user of users) {
    const plainPassword = plainPasswords[user.username];

    if (plainPassword && !user.password.startsWith("$2a$")) {
      const hashed = await bcrypt.hash(plainPassword, 12);
      user.password = hashed;
      modified = true;
    }
  }

  if (modified) {
    saveAllUsers(users);
    console.log("Passwords hashed and users.json updated.");
  }
}

// استدعاء دالة التشفير مباشرة عند التشغيل
hashPasswords();

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // البحث عن المستخدم
    const users = getAllUsers();
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ message: "اسم المستخدم غير موجود" });
    }

    // التحقق من كلمة المرور
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    }

    // إنشاء توكن JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // الرد بالتوكن والدور
    res.json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      role: user.role,
    });

  } catch (err) {
    console.error("خطأ أثناء تسجيل الدخول:", err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// GET users by role
router.get("/by-role/:role", (req, res) => {
  const roleName = req.params.role;
  const users = getAllUsers();
  const filtered = users.filter((u) => u.role === roleName);
  res.json(filtered);
});

module.exports = router;
