import Article from '../models/Article.js';
import Credential from '../models/Credential.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory of the current module using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the 'uploads' directory exists
const uploadDir = path.resolve(__dirname, '..', 'assets', 'uploads');


// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
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
      selectedDate
    } = req.body;

    console.log('📝 Incoming article POST request');
    console.log('Request Body:', req.body);
    console.log("File received (thumbnail):", req.file);

    let thumbnail = null;
    if (req.file) {
      thumbnail = req.file.filename;
      console.log('Thumbnail image saved as:', thumbnail);
    }

    if (!title || !article_category || !description || !user_id || !author || !address || !selectedDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // const userExists = await Credential.findById(user_id);
    // if (!userExists) {
    //   return res.status(404).json({ message: 'Author not found.' });
    // }

    const newArticle = await Article.create({
      title,
      article_category,
      description,
      user_id,
      author,
      address,
      upload_date: selectedDate,
      images: thumbnail,
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