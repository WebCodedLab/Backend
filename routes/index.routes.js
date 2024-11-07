import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import upload from '../config/multer.config.js';
import fileModel from '../models/file.model.js';
import appwriteStorage from '../config/appwrite.config.js';
import { ID } from 'appwrite'
import { Readable } from 'stream';

const router = express.Router();

router.get('/home', authMiddleware, (req, res) => {
  const token = req.cookies.token;
  res.render('home', { token: token });
});

router.post('/upload-file',authMiddleware, upload.single('file'), async (req, res) => {
  try {
    
    const result = await appwriteStorage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      ID.unique(),
      req.file,
    );

    const newFile = new fileModel({
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      // appwriteId: result.$id,
      userId: req.user.userID
    });

    await newFile.save();

    res.status(200).json({ message: 'File uploaded successfully', fileId: newFile._id });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message});
  }
});



export default router;