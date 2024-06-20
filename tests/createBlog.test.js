describe('createBlog', () => {
    it('should create a new blog post', async () => {
      const req = {
        body: { title: 'New Blog', body: 'This is the blog body.', state: 'published' },
        user: { _id: 'userId123' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      mongoose.model.mockFindById.mockResolvedValue({ first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' });
      mongoose.model.mockSave.mockResolvedValue({ _id: 'newBlogId', ...req.body, author: { name: 'John Doe', id: 'userId123' }, reading_time: 5 });

      await createBlog(req, res);

      expect(mongoose.model.mockFindById).toHaveBeenCalledWith('userId123');
      expect(mongoose.model.mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        LoggedIn_User: { username: 'John Doe', email: 'john.doe@example.com' },
        newBlogPost: expect.objectContaining({ _id: 'newBlogId', title: 'New Blog', body: 'This is the blog body.', state: 'published' }),
      });
    });

    it('should return 404 if user not found', async () => {
      const req = {
        body: { title: 'New Blog', body: 'This is the blog body.', state: 'published' },
        user: { _id: 'nonexistentUserId' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      mongoose.model.mockFindById.mockResolvedValue(null);

      await createBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors', async () => {
      const req = {
        body: { title: 'New Blog', body: 'This is the blog body.', state: 'published' },
        user: { _id: 'userId123' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      mongoose.model.mockFindById.mockRejectedValue(new Error('Database error'));

      await createBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });