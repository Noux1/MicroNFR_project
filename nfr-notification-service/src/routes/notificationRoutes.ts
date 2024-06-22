import express from 'express';
import { getAllNotifications, getNotification,ReadNotification} from '../controllers/notificationController'
import { verifyTokenAndAuthority } from '../middleware/AllNotifsMiddleware';
const router = express.Router();

router.get('/',verifyTokenAndAuthority, getAllNotifications);
router.get('/:notificationId',verifyTokenAndAuthority, getNotification);
router.put('/:id/read',verifyTokenAndAuthority, ReadNotification);



export { router as NotificationRoutes };