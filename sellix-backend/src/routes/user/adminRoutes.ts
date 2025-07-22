import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { isAdmin } from '../../middlewares/isAdmin';
import {
  getPendingListings,
  approveListing,
  hideListing,
  addCategory,
  addSubcategory,
  sendMessageToUser,
  getHiddenListings,
  unhideListing,
  editListing
} from '../../controllers/adminController';

const router = Router();

router.use(verifyToken, isAdmin);

router.get('/pending-listings', getPendingListings);
router.put('/approve-listing/:listingId', approveListing);
router.put('/hide-listing/:listingId', hideListing);
router.post('/add-category', addCategory);
router.post('/add-subcategory', addSubcategory);
router.post('/send-message', verifyToken, sendMessageToUser);
router.get('/hidden-listings', verifyToken, isAdmin, getHiddenListings);
router.put('/unhide-listing/:listingId', verifyToken, isAdmin, unhideListing);
router.put('/edit-listing/:listingId', verifyToken, isAdmin, editListing);

export default router;