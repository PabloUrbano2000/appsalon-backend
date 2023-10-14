import {
  sendEmailPasswordReset,
  sendEmailVerification,
} from "../emails/authEmailService.js";
import User from "../models/User.js";
import { generateJWT, uniqueId } from "../utils/index.js";

const register = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({
      msg: error.message,
    });
  }

  const { email, password = "", name } = req.body;

  const userExists = await User.findOne({
    email,
  });

  if (userExists) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({
      msg: error.message,
    });
  }

  const MIN_PASSWORD_LENGTH = 8;
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      "El password debe contener mínimo " + MIN_PASSWORD_LENGTH + " caracteres"
    );
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    const user = new User({ email, password, name });
    const result = await user.save();

    const { email: emailRes, name: nameRes, token } = result;

    sendEmailVerification({
      name: nameRes,
      email: emailRes,
      token,
    });

    return res.json({
      msg: "El usuario se creó correctamente, revisa tu email",
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Hubo un error, token no válido");
    return res.status(401).json({
      msg: error.message,
    });
  }

  try {
    user.verified = true;
    user.token = null;
    await user.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    const error = new Error("El Usuario no existe");
    return res.status(401).json({
      msg: error.message,
    });
  }

  if (!user.verified) {
    const error = new Error("Tu cuenta aun no ha sido confirmada");
    return res.status(401).json({
      msg: error.message,
    });
  }

  if (await user.checkPassword(password)) {
    const token = generateJWT(user._id);

    return res.json({
      token,
    });
  } else {
    const error = new Error("Email/contraseña incorrectos");
    return res.status(401).json({
      msg: error.message,
    });
  }
};

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El Usuario no existe");
    return res.status(403).json({
      msg: error.message,
    });
  }

  try {
    user.token = uniqueId();
    const result = await user.save();

    await sendEmailPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token,
    });

    res.json({
      msg: "Hemos enviado un email a tu correo",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;
  const isValidToken = await User.findOne({ token });
  if (!isValidToken) {
    const error = new Error("Hubo un error, token inválido");
    return res.json({
      msg: error.message,
    });
  }

  res.json({ msg: "Token válido" });
};

const updatePassword = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Hubo un error, token inválido");
    return res.json({
      msg: error.message,
    });
  }

  const { password } = req.body;

  try {
    user.token = "";
    user.password = password;
    await user.save();
    res.json({
      msg: "Password modificado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const admin = async (req, res) => {
  const { user } = req;
  if (!user.admin) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }
  res.json(user);
};

export {
  register,
  verifyAccount,
  login,
  user,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  admin,
};
