
const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;




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
  supervisor1: "sup@456", //  الغريب انها محفوظة ك no !!
  ops_manager: "Ops@789",
};

// دالة لتشفير كلمات المرور عند تشغيل السيرفر
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
hashPasswords();

// رمز OTP ثابت
const FIXED_OTP = "1234";

// تخزين OTP مؤقت 
const userOtpMap = new Map();

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

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    }

    // استخدام رمز OTP ثابت
    const otp = FIXED_OTP;

    // حفظ OTP مؤقتًا
    userOtpMap.set(user.username, otp);

    console.log(`رمز التحقق للمستخدم ${username} هو: ${otp}`); // فقط للعرض في الكونسول

    // إنشاء توكن JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "تم تسجيل الدخول بنجاح. يرجى إدخال رمز التحقق.",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("خطأ أثناء تسجيل الدخول:", err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// التحقق من OTP
router.post("/verify-otp", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "مفقود توكن التفويض" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "مفقود توكن التفويض" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "توكن غير صالح أو منتهي" });
    }

    const { username } = decoded;
    const sentOtp = req.body.otp;

    if (!sentOtp) {
      return res.status(400).json({ message: "يرجى إرسال رمز التحقق" });
    }

    const savedOtp = userOtpMap.get(username);

    if (!savedOtp) {
      return res.status(400).json({ message: "رمز التحقق غير موجود أو منتهي" });
    }

    if (sentOtp !== savedOtp) {
      return res.status(401).json({ message: "رمز التحقق غير صحيح" });
    }

    userOtpMap.delete(username);

    res.json({ message: "تم التحقق من رمز التحقق بنجاح" });
  } catch (err) {
    console.error("خطأ أثناء التحقق من OTP:", err);
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
