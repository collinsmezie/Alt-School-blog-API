const mongoose = require('mongoose');
const { getPublishedBlogByTitle } = require('../controllers/blogController');

jest.mock('mongoose');

describe('Blog Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublishedBlogByTitle', () => {
    it('should return the blog and increment read count', async () => {
      const req = { params: { title: 'Test Title' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      mongoose.model.mockFindOneAndUpdate.mockResolvedValue({ title: 'Test Title', state: 'published', read_count: 1 });

      await getPublishedBlogByTitle(req, res);

      expect(mongoose.model.mockFindOneAndUpdate).toHaveBeenCalledWith(
        { title: req.params.title, state: 'published' },
        { $inc: { read_count: 1 } },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({ title: 'Test Title', state: 'published', read_count: 1 });
    });

    it('should return 404 if blog not found', async () => {
      const req = { params: { title: 'Nonexistent Title' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      mongoose.model.mockFindOneAndUpdate.mockResolvedValue(null);

      await getPublishedBlogByTitle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Blog not found or not published' });
    });

    it('should handle errors', async () => {
      const req = { params: { title: 'Test Title' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      mongoose.model.mockFindOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await getPublishedBlogByTitle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

});
