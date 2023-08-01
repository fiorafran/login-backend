import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUp = async (req, res) => {
  try {
    const { JWT_SECRET } = process.env;
    const { email, password, fullName } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Campos incompletos" });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName: fullName,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", error: err });
  }
};

const logIn = async (req, res) => {
  try {
    const { JWT_SECRET } = process.env;

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Campos incompletos" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Usuario inexistente" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { userId: user._id, userFullName: user.fullName },
      JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", error: err });
  }
};

export { signUp, logIn };
