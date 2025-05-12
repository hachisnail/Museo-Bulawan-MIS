import Article from '../models/Article.js';
import Credential from '../models/Credential.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the 'uploads' directory exists
const uploadDir = path.resolve(__dirname, '..', 'assets', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });
export { upload };

// Controller to handle multiple content images
export const uploadContentImages = async (req, res) => {
  try {
    // req.files is an array of files
    const images = req.files.map((file) => file.filename);
    return res.status(200).json({
      message: 'Content images uploaded successfully',
      images,
    });
  } catch (error) {
    console.error('Error uploading content images:', error.message);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Controller to handle article creation
export const createArticle = async (req, res) => {
  try {
    const {
      title,
      article_category,
      description,
      user_id,
      author,
      address,
      selectedDate,
      content_images // We'll receive this as a JSON array from the frontend
    } = req.body;

    console.log('📝 Incoming article POST request');
    console.log('Request Body:', req.body);
    console.log('File received (thumbnail):', req.file);

    let thumbnail = null;
    if (req.file) {
      thumbnail = req.file.filename;
      console.log('Thumbnail image saved as:', thumbnail);
    }

    if (!title || !article_category || !description || !user_id || !author || !address || !selectedDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // If you're storing content_images as TEXT, convert array -> JSON string
    let contentImagesString = null;
    if (content_images) {
      // If the frontend sent a stringified JSON array, parse it
      // or if it’s already an array, just stringify it
      if (typeof content_images === 'string') {
        contentImagesString = content_images;
      } else {
        contentImagesString = JSON.stringify(content_images);
      }
    }

    const newArticle = await Article.create({
      title,
      article_category,
      description,
      user_id,
      author,
      address,
      upload_date: selectedDate,
      images: thumbnail,
      content_images: contentImagesString,
    });

    console.log('✅ Article successfully created:', newArticle);

    return res.status(201).json({
      message: 'Article created successfully',
      article: newArticle
    });
  } catch (error) {
    console.error('💥 Error creating article:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve all articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json(articles);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Server error retrieving appointments.' });
  }
};

// Retrieve public articles (lightweight)
export const getPublicArticles = async (req, res) => {
  const API_URL = process.env.VITE_API_URL;

  try {
    const articles = await Article.findAll({
      attributes: ['article_id','images', 'title', 'article_category', 'upload_date'],
      order: [['created_at', 'DESC']],
    });

    const formattedArticles = articles.map(article => ({
      ...article.dataValues,
      images: article.images ? `${API_URL}/uploads/${article.images}` : null,
    }));

    return res.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching public articles:', error);
    return res.status(500).json({ message: 'Server error retrieving public articles.' });
  }
};

// Display a specific article
export const getPublicArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Article ID is required.' });
    }

    const article = await Article.findOne({
      where: { article_id: id },
      attributes: [
        'article_id',
        'title',
        'user_id',
        'upload_date',
        'images',
        'content_images', // Include content_images so the public endpoint can return them
        'article_category',
        'description',
        'author',
        'address',
        'status',
        'upload_period_start',
        'upload_period_end',
        'created_at',
        'updated_at'
      ]
    });

    return res.json(article);
  } catch (error) {
    console.error('Error fetching public article:', error);
    return res.status(500).json({ message: 'Server error retrieving public article.' });
  }
};



// Controller: update an existing Article
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params; // e.g., /article/11 => id=11
    const {
      title,
      article_category,
      description,
      user_id,
      author,
      address,
      selectedDate,
      content_images
    } = req.body;

    // If a new thumbnail file was uploaded
    let thumbnail = null;
    if (req.file) {
      thumbnail = req.file.filename;
    }

    // Convert content_images to JSON if needed
    let contentImagesString = null;
    if (content_images) {
      if (typeof content_images === 'string') {
        contentImagesString = content_images;
      } else {
        contentImagesString = JSON.stringify(content_images);
      }
    }

    // Use Sequelize to update the article
    const [updatedCount] = await Article.update(
      {
        title,
        article_category,
        description,
        user_id,
        author,
        address,
        upload_date: selectedDate,
        // Only update images if a new thumbnail was actually uploaded:
        images: thumbnail ? thumbnail : undefined,
        content_images: contentImagesString
      },
      {
        where: { article_id: id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        message: `Article ID ${id} not found or no changes made.`,
      });
    }

    // Optionally fetch the updated article
    const updatedArticle = await Article.findOne({ where: { article_id: id } });
    return res.status(200).json({
      message: 'Article updated successfully',
      article: updatedArticle
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return res.status(500).json({
      message: 'Server error updating article',
      error: error.message
    });
  }
};
