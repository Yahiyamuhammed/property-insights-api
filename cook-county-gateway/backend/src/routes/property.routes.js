import express from 'express';
import { getPropertyDetails } from '../controllers/property.controller.js';

const router = express.Router();

router.get('/:pin', getPropertyDetails);

export default router;