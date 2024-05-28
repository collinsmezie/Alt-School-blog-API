const { getAllBlogsByUserId } = require('../controllers/blogController'); // Change to your actual controller file
const UserModel = require('../models/users');
const Blog = require('../models/blog');

jest.mock('../models/users');
jest.mock('../models/blog');

describe('getAllBlogsByUserId function', () => {


    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return user not found error if user does not exist', async () => {
        const req = { user: { _id: 'userId' }, params: { authorId: 'authorId' }, query: { state: 'draft' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        UserModel.findById.mockResolvedValueOnce(null);

        await getAllBlogsByUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('should return bad request error if author id is not provided', async () => {
        const req = { user: { _id: 'userId' }, params: {}, query: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAllBlogsByUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Bad request - No author id provided' });
    });

    test('should return blogs with pagination information', async () => {
        const req = { user: { _id: 'userId' }, params: { authorId: 'authorId' }, query: { state: 'published', page: '1' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const user = { _id: 'userId', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };
        const blogs = [
            {
                _id: 'blogId1',
                title: 'Blog 1',
                description: 'Content 1',
                state: 'published',
                author: {
                    id: 'authorId',
                    username: 'John Doe',
                    email: 'john.doe@example.com'
                },
                timestamp: '2021-01-01T00:00:00.000Z',
                tags: ['tag1', 'tag2'],
                read_count: 10,
                reading_time: 10,
                body: 'Content 1 body'
            },
            {
                _id: 'blogId2',
                title: 'Blog 2',
                description: 'Content 2',
                state: 'draft',
                author: {
                    id: 'authorId',
                    username: 'sergey Brin',
                    email: 'sergey.brin@example.com'
                },
                timestamp: '2021-01-01T00:00:00.000Z',
                tags: ['tag1', 'tag2'],
                read_count: 5,
                reading_time: 5,
                body: 'Content 2 body'
            }];
        const count = 5;
        const totalCount = 10;
        UserModel.findById.mockResolvedValueOnce(user);
        Blog.countDocuments.mockResolvedValueOnce(totalCount);

        Blog.find.mockReturnValueOnce({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValueOnce(blogs)
        });

        await getAllBlogsByUserId(req, res);

        expect(res.json).toHaveBeenCalledWith({
            LoggedIn_User: { username: 'John Doe', email: 'john.doe@example.com' },
            blogPosts: blogs,
            pagination: { page: 1, limit: 3, totalCount, totalPages: Math.ceil(totalCount / 3) }
        });
    });

});
