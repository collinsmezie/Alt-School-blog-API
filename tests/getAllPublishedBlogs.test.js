const request = require('supertest');
const app = require('../app'); // Assuming your app is exported from app.js
const getAllPublishedBlogs = require('../controllers/blogsController').getAllPublishedBlogs;

describe('getAllPublishedBlogs', () => {
    const req = {
      query: {
        page: 1,
        limit: 20,
        author: 'John Doe',
        title: 'Test',
        sortBy: 'read_count',
      },
    };
  
    const res = {
      json: jest.fn(),
    };
  
    it('should return published blogs with correct data and pagination', async () => {
      await getAllPublishedBlogs(req, res);
  
      expect(res.json).toHaveBeenCalled();
    });
  
    it('should handle errors and return a 500 status code', async () => {
      Blog.find.mockRejectedValueOnce(new Error('Test error'));
  
      await getAllPublishedBlogs(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Test error' });
    });
  });