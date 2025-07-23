const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// مفتاح التشفير الخاص بـ JWT 
const JWT_SECRET = "سري_جدا_لا_تشارك_مع_أحد";

// قاعدة بيانات وهمية للمستخدمين
const users = [
  {
    id: 1,
    username: "tech_user1",
    password: "", // سيتم التشفير لاحقًا
    role: "فني",
  },
  {
    id: 2,
    username: "supervisor1",
    password: "",
    role: "مشرف صيانة",
  },
  {
    id: 3,
    username: "ops_manager",
    password: "",
    role: "مدير عمليات",
  },
];

// كلمات المرور الأصلية لكل مستخدم
const plainPasswords = {
  tech_user1: "Tech@123",
  supervisor1: "no",
  ops_manager: "Ops@789",
};

// دالة تشفير كلمات المرور عند بداية تشغيل السيرفر
async function hashPasswords() {
  for (let user of users) {
    const plainPassword = plainPasswords[user.username];
    if (plainPassword) {
      const hashed = await bcrypt.hash(plainPassword, 12);
      user.password = hashed;
    }
  }
}

// استدعاء دالة التشفير مباشرة عند التشغيل
hashPasswords();

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // البحث عن المستخدم
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

module.exports = router;
