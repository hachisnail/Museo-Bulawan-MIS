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

export const getPublicArticles = async (req, res) => {
  //  console.log("Hit /api/public-article/:id")
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

//display specific article
export const getPublicArticle = async (req, res) => {
  try {
    const { id } = req.params;  

    if (!id) {
      return res.status(400).json({ message: 'Article ID is required.' }); // Handle case where no ID is provided
    }

    // Fetch the specific article by article_id
    const article = await Article.findOne({
      where: { article_id: id },
      attributes: [
        'article_id',         // article_id (Primary Key, auto_increment)
        'title',              // title (Article title)
        'user_id',            // user_id (User who posted the article)
        'upload_date',        // upload_date (When the article was uploaded)
        'images',             // images (Article images, stored as text)
        'article_category',   // article_category (Category of the article)
        'description',        // description (Full description of the article)
        'author',             // author (Author of the article)
        'address',            // address (Address linked to the article, optional)
        'status',             // status (Article status, e.g., 'pending' or 'posted')
        'upload_period_start',// upload_period_start (Start of the article visibility period)
        'upload_period_end',  // upload_period_end (End of the article visibility period)
        'created_at',         // created_at (Timestamp of when the article was created)
        'updated_at'          // updated_at (Timestamp of when the article was last updated)
      ]
    });

    return res.json(article);
  } catch (error) {
    console.error('Error fetching public article:', error);
    return res.status(500).json({ message: 'Server error retrieving public article.' });
  }
};

