import { Router } from 'express';
import {getAllEvents,getEventById,filterAuditEvents} from '../controllers/audit-controllers';
import { verifyTokenAndAuthority } from '../middlewares/AuditAuthMiddleware';
const router = Router();

router.get('/events',verifyTokenAndAuthority, getAllEvents);
router.get('/events/:eventId',verifyTokenAndAuthority, getEventById);
router.get('/filter',verifyTokenAndAuthority, filterAuditEvents);


export default router;