import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateLoginSchema, validateSignUpSchema } from "../Schemas/user.js";

const signUp = async (req, res) => {
  try {
    const { JWT_SECRET } = process.env;

    const result = validateSignUpSchema(req.body);

    if (result.error)
      return res.status(400).json({ error: result.error.message });
    const { email, password, fullName } = result.data;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({ message: "El usuario ya existe" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: newUser._id, userFullName: newUser.fullName },
      JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );
    res.status(200).json({ message: "Usuario registrado exitosamente", token });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", error: err });
  }
};

const logIn = async (req, res) => {
  try {
    const { JWT_SECRET } = process.env;

    const result = validateLoginSchema(req.body);

    if (result.error)
      return res.status(400).json({ error: result.error.message });

    const { email, password } = result.data;

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
