import jwt from "jsonwebtoken";

// تحقق من وجود توكن
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // نخزن بيانات المستخدم في request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// حماية صلاحيات الأدمن
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};