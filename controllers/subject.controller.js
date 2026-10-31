const subjectService = require('../services/subject.service');

class SubjectController {
  async getSubjects(req, res, next) {
    try {
      const { categoryId } = req.query;
      const subjects = await subjectService.getSubjects({ categoryId });
      return res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubjectById(req, res, next) {
    try {
      const subject = await subjectService.getSubjectById(req.params.id);
      return res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubject(req, res, next) {
    try {
      const subject = await subjectService.createSubject(req.body);
      return res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSubject(req, res, next) {
    try {
      const subject = await subjectService.updateSubject(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Subject updated successfully',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSubject(req, res, next) {
    try {
      await subjectService.deleteSubject(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Subject deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();

