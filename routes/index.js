import express from 'express';
import usersRouter from './users.js';
const Router = express.Router;

const router = Router();

router.use('/users', usersRouter);

export default router;