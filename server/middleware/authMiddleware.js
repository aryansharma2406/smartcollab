const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization); // debug

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, "secret123");

    console.log("DECODED:", decoded); // debug

    req.user = decoded;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message); // debug
    return res.status(401).json({ msg: "Invalid token" });
  }
};