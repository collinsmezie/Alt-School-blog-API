const mongoose = jest.createMockFromModule('mongoose');

const mockFindOneAndUpdate = jest.fn();
const mockSave = jest.fn();
const mockFindById = jest.fn();

const Blog = {
  findOneAndUpdate: mockFindOneAndUpdate,
  save: mockSave,
};

const UserModel = {
  findById: mockFindById,
};

mongoose.model = (modelName) => {
  if (modelName === 'Blog') return Blog;
  if (modelName === 'UserModel') return UserModel;
  return {};
};

mongoose.Schema = function() {
  return {
    methods: {}
  };
};

mongoose.model.mockFindOneAndUpdate = mockFindOneAndUpdate;
mongoose.model.mockSave = mockSave;
mongoose.model.mockFindById = mockFindById;

module.exports = mongoose;
