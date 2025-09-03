const { signup, login } = require('../services/authService');
const passport = require('passport');

exports.signup = async (req: any, res: any) => {
  try {
    const { username, email, password, authProvider } = req.body;
    const user = await signup(username, email, password, authProvider);
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = (req: any, res: any, next: any) => {
  passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) return res.status(401).json({ error: info ? info.message : 'Login failed' });
    const token = require('jsonwebtoken').sign({ id: user.id }, 'secret-key', { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  })(req, res, next);
};