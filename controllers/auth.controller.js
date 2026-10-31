const authService = require('../services/auth.service');

class AuthController {
  /**
   * User Sign Up
   * POST /api/auth/user/signup
   */
  async userSignUp(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.userSignUp({ name, email, password });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * User Sign In
   * POST /api/auth/user/signin
   */
  async userSignIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.userSignIn({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Signed in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin Sign In
   * POST /api/auth/admin/signin
   */
  async adminSignIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.adminSignIn({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Admin signed in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Current Authenticated Profile
   * GET /api/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);

      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
