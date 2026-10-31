const chapterService = require('../services/chapter.service');

class ChapterController {
  async getChapters(req, res, next) {
    try {
      const { subjectId, categoryId } = req.query;
      const chapters = await chapterService.getChapters({ subjectId, categoryId });
      return res.status(200).json({
        success: true,
        data: chapters,
      });
    } catch (error) {
      next(error);
    }
  }

  async getChapterById(req, res, next) {
    try {
      const chapter = await chapterService.getChapterById(req.params.id);
      return res.status(200).json({
        success: true,
        data: chapter,
      });
    } catch (error) {
      next(error);
    }
  }

  async createChapter(req, res, next) {
    try {
      const chapter = await chapterService.createChapter(req.body);
      return res.status(201).json({
        success: true,
        message: 'Chapter created successfully',
        data: chapter,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateChapter(req, res, next) {
    try {
      const chapter = await chapterService.updateChapter(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Chapter updated successfully',
        data: chapter,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteChapter(req, res, next) {
    try {
      await chapterService.deleteChapter(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Chapter deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChapterController();

