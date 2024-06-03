require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Log = require("../models/log"); // Importujemy model Log
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const nodemailer = require("nodemailer");

// Funkcja do tworzenia logów
async function createLog(userId, action, details, createdBy) {
  try {
    const log = new Log({ user: userId, action, details, createdBy });
    await log.save();
    console.log(`Log created: ${action} - ${details}`);
  } catch (error) {
    console.error("Error creating log:", error);
  }
}


async function sendEmail(to, link, subject, html) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  let info = await transporter.sendMail({
    from: '"nodex.goplusbet.pl" <your-email@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
}

router.post('/register', auth, async (req, res) => {
  const { username, firstName, lastName, role } = req.body;

  if (req.user.role !== 'Admin') {
    return res.status(403).send('Access denied');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    const newUser = new User({
      username,
      firstName,
      lastName,
      role,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Utworzenie linku do ustawienia hasła
    const link = `https://nodex.goplusbet.pl/set-password/${token}`;

    // Poprawione wywołanie sendEmail z odpowiednimi argumentami
    await sendEmail(
      username,
      link,
      "Witaj w nodex.goplusbet.pl",
      `<p>Login: ${username}</p><p>Hasło: Kliknij <a href="${link}">tutaj</a>, aby ustawić swoje hasło.</p><p>Link będzie aktywny 24 godziny.</p>`
    );

    // Utworzenie logu z informacją o tym, kto stworzył nowego użytkownika
    await createLog(savedUser._id, "REGISTER", `Created new user with role ${role}`, req.user.userId);

    res.status(201).send("User registered successfully. Please check your email to set your password.");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Failed to create user.");
  }
});

router.post("/set-password", async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res.status(400).send("Missing password or token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save(); // Tu hasło powinno być zapisane do bazy

    await createLog(user._id, "SET_PASSWORD", "Password updated successfully");

    res.send("Password updated successfully");
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).send("Failed to set password");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found during login:", username);
      return res.status(401).send("Nieprawidłowe dane logowania - brak użytkownika");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      console.log("Incorrect password for user:", username);
      return res.status(401).send("Nieprawidłowe dane logowania - błędne hasło");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    console.log("Logging in user:", username);
    await createLog(user._id, "LOGIN", "User logged in");

    res.status(200).send({
      message: "Logged in successfully",
      token,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send(error.message);
  }
});


router.post("/change-password", auth, async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId); // req.user jest dostępne dzięki middleware 'auth'
    if (!user) {
      return res.status(404).send("Użytkownik nie znaleziony");
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await createLog(user._id, "CHANGE_PASSWORD", "Password changed successfully");

    res.send("Hasło zostało zmienione pomyślnie");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Nie udało się zmienić hasła.");
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).send("Error retrieving user profile");
  }
});

router.post("/test-hash", async (req, res) => {
  const password = "testPassword123";
  const hashedPassword = await bcrypt.hash(password, 12);
  const isMatch = await bcrypt.compare(password, hashedPassword);
  res.send({
    hashedPassword,
    isMatch,
  });
});

router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(404).send("No user with that email exists.");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `https://nodex.goplusbet.pl/set-password/${token}`;
    await sendEmail(
      email,
      resetLink,
      "Zresetuj swoje hasło w nodex.goplusbet.pl",
      `<p>Kliknij <a href="${resetLink}">tutaj</a>, aby zresetować swoje hasło.</p><p>Link będzie aktywny 12 godzin.</p>`
    );

    await createLog(user._id, "RESET_PASSWORD_REQUEST", "Password reset link sent");

    res.send(
      "If a user with that email is registered, a password reset link has been sent."
    );
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).send("Failed to send password reset link.");
  }
});

// Endpoint do pobierania danych z dashboardu
router.get("/dashboard", auth, (req, res) => {
  res.send(`Cześć ${req.user.username}, your role is ${req.user.role}`);
});

router.post("/logout", auth, async (req, res) => {
  try {
    // Usuwamy wywołanie createLog dla akcji LOGOUT
    res.status(200).send("User logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Failed to log out user.");
  }
});



// Endpoint do pobierania logów
router.get("/logs", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).send("Access denied");
    }

    const logs = await Log.find().populate("user", "username").sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).send("Failed to retrieve logs.");
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).send("Access denied");
    }

    const users = await User.find().select("username role");
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send("Failed to retrieve users.");
  }
});


router.get("/logs/:userId", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).send("Access denied");
    }

    const logs = await Log.find({ user: req.params.userId })
      .populate("user", "username")
      .populate("createdBy", "username") // Dodane populowanie createdBy
      .sort({ timestamp: -1 });
    
    res.json(logs);
  } catch (error) {
    console.error("Error retrieving user logs:", error);
    res.status(500).send("Failed to retrieve user logs.");
  }
});



module.exports = router;
