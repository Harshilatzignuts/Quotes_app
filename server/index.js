const express = require("express");

const app = express();

const cors = require("cors");

const mongoose = require("mongoose");

const User = require("./models/user.model");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

app.use(cors());

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://dave07:daveHM@cluster0.bhofjxn.mongodb.net/MERN_AUTH_PRACTICE"
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });

    localStorage.setItem("Users", data);
    res.json({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error: "Duplicate email",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({
      status: "error",
      error: "Invalid login",
      user: false,
    });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );

    return res.json({
      status: "ok",
      user: {
        name: user.name,
        email: user.email,
        token: token,
      },
    });
  } else {
    return res.json({
      status: "error",
      error: "Invalid login",
      user: false,
    });
  }
});
app.put("/api/updateProfile", async (req, res) => {
  const token = jwt.sign(
    {
      name: req.body.name,
      email: req.body.email,
    },
    "secret123"
  );

  try {
    const decoded = jwt.verify(token, "secret123");

    // Assuming your user model is called 'User'
    await User.updateOne(
      { email: decoded.email },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      }
    );

    return res.json({
      status: "ok",
      user: {
        name: req.body.name,
        email: req.body.email,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      error: "Failed to update profile",
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      status: "ok",
      users: users.map((user) => ({
        name: user.name,
        email: user.email,
        quotes: user.quotes,
      })),
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: "Unable to fetch users",
    });
  }
});

app.get("/api/quote/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.json({
        status: "error",
        error: "User not found",
      });
    }

    return res.json({
      status: "ok",
      quotes: user.quotes || [],
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: "Unable to fetch user quotes",
    });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");

    const email = decoded.email;

    const user = await User.findOne({
      email: email,
    });

    return res.json({
      status: "ok",
      quotes: user.quotes || [],
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: "Invalid token",
    });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");

    const email = decoded.email;

    await User.updateOne(
      {
        email: email,
      },
      {
        $push: {
          quotes: req.body.quote,
        },
      }
    );

    return res.json({
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: "Invalid token",
    });
  }
});
app.put("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");

    const email = decoded.email;

    await User.updateOne(
      {
        email: email,
      },
      {
        $set: {
          quotes: req.body.quotes,
        },
      }
    );

    return res.json({
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: "Invalid token",
    });
  }
});

app.listen(1337, () => {
  console.log("Server listening on port 1337");
});
