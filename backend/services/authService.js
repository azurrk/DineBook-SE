const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register(name, email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create(name, email, hashedPassword);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    return { user, token };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    return { user: userWithoutPassword, token };
  }

  async updateProfile(userId, name, email, phone) {
    const user = await userRepository.update(userId, name, email, phone);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();
