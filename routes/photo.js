import Router from 'express-promise-router';
import Photos from '../controllers/photos';

const router = new Router();

// Index route - show all photos
router.get('/', Photos.getAll);

// Create route - add new photo
router.post('/', Photos.create);

// Show route - show one photo
router.get('/:id', Photos.getOne);

// Update route - update one photo
router.put('/:id', Photos.update);

// Destroy route - delete photo
router.delete('/:id', Photos.delete);

export default router;