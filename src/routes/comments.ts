import express from 'express'
import {
  getComments,
  createComment,
  deleteComment
} from '../controllers/comments'

import { body } from 'express-validator'

const router = express.Router()

router.get('/:id', getComments)
router.post('/:id', [body('text').isLength({ min: 1 })], createComment)
router.delete('/:id', deleteComment)

export default router
