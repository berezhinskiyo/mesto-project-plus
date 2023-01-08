import { Router } from 'express';
import {
  getUsers, createUser, getUser, patchMe, patchMeAvatar,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', patchMe);
router.patch('/me/avatar', patchMeAvatar);
export default router;
