import Router from 'express-promise-router';
import Photos from '../controllers/photos';
import Users from '../controllers/users';
import multer from 'multer';
const router = new Router();

// Configure multer
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const imageFilter = (req, file, cb) => {
  
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter});

// Index route - show all photos
router.get('/', Users.jwt(), Photos.getAll);

// Create route - add new photo
router.post('/', upload.single('image'), Photos.create);

// Show route - show one photo
router.get('/:id', Users.jwt(), Photos.getOne);

// Update route - update one photo
router.put('/:id', Photos.update);

// Destroy route - delete photo
router.delete('/:id', Photos.delete);

// Update likes
router.put('/:id/like', Photos.like);

export default router;