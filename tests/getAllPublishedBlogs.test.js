const mongoose = require('mongoose');
const Blog = require('../models/blog');
const { getAllPublishedBlogs } = require('../controllers/blogController'); // adjust the path as necessary

jest.mock('../models/blog');

describe('getAllPublishedBlogs', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all published blogs with default pagination and no filters', async () => {
        const mockBlogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
        Blog.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockBlogs)
        });
        Blog.countDocuments.mockResolvedValue(2);

        await getAllPublishedBlogs(req, res);

        expect(Blog.find).toHaveBeenCalledWith({ state: 'published' });
        expect(Blog.find().sort).toHaveBeenCalledWith({});
        expect(Blog.find().skip).toHaveBeenCalledWith(-0); // page = 0, limit = 0 by default, so skip = (0 - 1) * 0 = -1
        expect(Blog.find().limit).toHaveBeenCalledWith(0);
        expect(res.json).toHaveBeenCalledWith({
            data: expect.any(Array),
            pagination: {
                page: 0,
                limit: 0,
                totalCount: 2,
                totalPages: Infinity // 2 / 0 is Infinity
            }
        });
    });

    it('should filter blogs by author', async () => {
        req.query.author = 'John Doe';
        const mockBlogs = [{ title: 'Blog by John Doe' }];
        Blog.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockBlogs)
        });
        Blog.countDocuments.mockResolvedValue(1);

        await getAllPublishedBlogs(req, res);

        expect(Blog.find).toHaveBeenCalledWith({
            state: 'published',
            'author.name': expect.any(RegExp)
        });
        expect(res.json).toHaveBeenCalledWith({
            data: expect.any(Array),
            pagination: {
                page: 0,
                limit: 0,
                totalCount: 1,
                totalPages: Infinity
            }
        });
    });

    it('should filter blogs by title', async () => {
        req.query.title = 'Tech';
        const mockBlogs = [{ title: 'Tech Blog' }];
        Blog.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockBlogs)
        });
        Blog.countDocuments.mockResolvedValue(1);

        await getAllPublishedBlogs(req, res);

        expect(Blog.find).toHaveBeenCalledWith({
            state: 'published',
            title: { $regex: 'Tech', $options: 'i' }
        });
        expect(res.json).toHaveBeenCalledWith({
            data: expect.any(Array),
            pagination: {
                page: 0,
                limit: 0,
                totalCount: 1,
                totalPages: Infinity
            }
        });
    });

    it('should filter blogs by tags', async () => {
        req.query.tags = 'tech,science';
        const mockBlogs = [{ title: 'Tech and Science Blog' }];
        Blog.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockBlogs)
        });
        Blog.countDocuments.mockResolvedValue(1);

        await getAllPublishedBlogs(req, res);

        expect(Blog.find).toHaveBeenCalledWith({
            state: 'published',
            tags: { $in: ['tech', 'science'] }
        });
        expect(res.json).toHaveBeenCalledWith({
            data: expect.any(Array),
            pagination: {
                page: 0,
                limit: 0,
                totalCount: 1,
                totalPages: Infinity
            }
        });
    });

    it('should sort blogs by read_count', async () => {
        req.query.sortBy = 'read_count';
        const mockBlogs = [{ title: 'Popular Blog', read_count: 100 }];
        Blog.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockBlogs)
        });
        Blog.countDocuments.mockResolvedValue(1);

        await getAllPublishedBlogs(req, res);

        expect(Blog.find).toHaveBeenCalledWith({ state: 'published' });
        expect(Blog.find().sort).toHaveBeenCalledWith({ read_count: 1 });
        expect(res.json).toHaveBeenCalledWith({
            data: expect.any(Array),
            pagination: {
                page: 0,
                limit: 0,
                totalCount: 1,
                totalPages: Infinity
            }
        });
    });

    it('should handle errors gracefully', async () => {
        const errorMessage = 'Something went wrong';
        Blog.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockRejectedValue(new Error(errorMessage))
        });

        await getAllPublishedBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});
