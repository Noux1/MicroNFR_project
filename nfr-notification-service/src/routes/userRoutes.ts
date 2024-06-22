import express from 'express';
import { getNotificationsForUser,sendEmailNotification,addUser } from '../controllers/userController';
import { verifyTokenAndUserMatch } from '../middleware/UserNotifsiddleware';

const router = express.Router();

router.get('/:userId/notifications', verifyTokenAndUserMatch,getNotificationsForUser);
router.post('/:userId/send-email', sendEmailNotification);
router.post('/', addUser);




export { router as UserRoutes };