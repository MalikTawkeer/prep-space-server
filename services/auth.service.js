const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class AuthService {
  /**
   * Helper to generate JWT token
   */
  generateToken(user) {
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn }
    );
  }

  /**
   * User Sign Up
   */
  async userSignUp({ name, email, password }) {
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error('An account with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Always enforce 'user' role for self-registration
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user',
    });

    await user.save();

    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * User Sign In
   */
  async userSignIn({ email, password }) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account has been deactivated. Please contact support.');
      error.statusCode = 403;
      throw error;
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Admin Sign In
   */
  async adminSignIn({ email, password }) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find admin user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Admin account is inactive');
      error.statusCode = 403;
      throw error;
    }

    // Enforce admin role
    if (user.role !== 'admin') {
      const error = new Error('Access denied: Administrator privileges required');
      error.statusCode = 403;
      throw error;
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Get User by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user.toJSON();
  }
}

module.exports = new AuthService();
