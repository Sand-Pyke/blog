import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 使用 .env 配置的上传目录，默认 backend/uploads/
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsDir = path.resolve(process.cwd(), uploadDir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 默认 5MB

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名，保留原始扩展名
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req: any, file: any, cb: any) => {
  // 只接受图片文件
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxFileSize
  }
});

// 图片上传路由
router.post('/image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    // 返回图片URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 错误处理
router.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      const sizeMB = Math.round(maxFileSize / 1024 / 1024);
      return res.status(400).json({ error: `文件大小不能超过${sizeMB}MB` });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message === '只允许上传图片文件') {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: '上传失败' });
});

export default router;