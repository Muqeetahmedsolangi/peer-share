const bcrypt = require('bcrypt');
const { User } = require('../models/user');

exports.signup = async (username: any, email: any, password: any, authProvider: any) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword, authProvider });
  return user;
};

exports.login = async (email: any, password: any) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }
  return user;
};