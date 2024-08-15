const User = require("./usersModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs/promises");

const avatarsDir = path.join(__dirname, "../public/avatars");

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey");
    const user = await User.findById(decoded.userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const signup = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarURL = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "identicon",
    });

    user = new User({
      email,
      password: hashedPassword,
      avatarURL,
    });

    await user.save();

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).jsoN({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

const currentUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const updateUserSubscription = async (req, res) => {
  const { subscription } = req.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid subscription value",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    },
  });
};

const updateAvatar = async (req, res) => {
  try {
    const { file, user } = req;
    const { path: tempPath, filename } = file;
    const [extension] = filename.split(".").slice(-1);
    const newFilename = `${user._id}-${Date.now()}.${extension}`;
    const newPath = path.join(avatarsDir, newFilename);

    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(newPath);

    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${newFilename}`;
    user.avatarURL = avatarURL;

    await user.save();

    res.status(200).json({ avatarURL });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  authMiddleware,
  currentUser,
  updateUserSubscription,
  updateAvatar,
};
