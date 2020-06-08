import express from 'express'
import { check } from 'express-validator'
import { createApplication, deleteApplication, getAllApplications, getApplications, updateApplication } from '../controllers/applications'
import { authorize } from '../util/auth'
import { Role } from '../util/role'

const router = express.Router()

router.get('/', getApplications)
router.get('/all', authorize([Role.admin]), getAllApplications)

router.post(
  '/',
  [
    check('company').isLength({ min: 3, max: 64 }),
    check('position').isLength({ min: 3, max: 64 }),
    check('submissionLink').isLength({ min: 3, max: 256 }),
    check('status').isLength({ min: 3, max: 64 }),
    check('submissionDate').isISO8601()
  ],
  createApplication
)
router.put(
  '/:id',
  [
    check('company').optional().isLength({ min: 3, max: 64 }),
    check('position').optional().isLength({ min: 3, max: 64 }),
    check('submissionLink').optional().isLength({ min: 3, max: 256 }),
    check('status').optional().isLength({ min: 3, max: 64 }),
    check('submissionDate').optional().isISO8601()
  ],
  updateApplication
)
router.delete('/:id', deleteApplication)

export default router
