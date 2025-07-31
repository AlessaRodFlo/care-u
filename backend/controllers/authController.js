const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require('../config/mail');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Correo ya registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    await transporter.sendMail({
      from: `"CARE-U" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Confirma tu cuenta en CARE-U',
      html: `
        <h2>Hola ${user.name}</h2>
        <p>Por favor confirma tu cuenta haciendo clic aquí:</p>
        <a href="${process.env.BASE_URL}/confirm/${token}">Confirmar cuenta</a>
      `
    });

    res.status(201).json({ message: 'Registro exitoso. Revisa tu correo 📩' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.verified) {
      return res.status(200).json({ message: 'Cuenta ya verificada' });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada exitosamente ✅' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado' });

    if (!user.verified) return res.status(401).json({ message: 'Confirma tu cuenta primero' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

exports.sendResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    await transporter.sendMail({
      to: email,
      subject: 'Recuperación de contraseña - CARE-U',
      html: `
        <p>Solicitaste cambiar tu contraseña.</p>
        <a href="${process.env.BASE_URL}/reset/${token}">Haz clic aquí para crear una nueva</a>
        <p>Este enlace expira en 15 minutos.</p>
      `
    });

    res.status(200).json({ message: 'Correo enviado con instrucciones 📩' });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar correo' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente ✅' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};
