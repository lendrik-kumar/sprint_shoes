import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '@middleware/index';
import { AuthenticatedRequest, UserRole } from '@types';

const router = Router();

// ── Ensure uploads directory exists ─────────────────────────────────────────
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── Multer disk storage ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, webp, avif, gif)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ── POST /api/upload/product-image ───────────────────────────────────────────
router.post(
  '/product-image',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPERADMIN),
  upload.single('image'),
  (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const url = `/uploads/products/${req.file.filename}`;
    res.status(201).json({ success: true, data: { url } });
  },
);

export default router;
