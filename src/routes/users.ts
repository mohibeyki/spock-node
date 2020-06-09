import express from 'express'
import { check } from 'express-validator'
import { createUser, getUsers, postLogin, updateUser } from '../controllers/user'
import { authorize } from '../util/auth'
import { Role } from '../util/role'

const router = express.Router()

router.get('/', authorize([Role.admin]), getUsers)
router.post(
  '/',
  [
    check('email')
      .isEmail()
      .withMessage('invalid email address')
      .normalizeEmail(),
    check('password')
      .isLength({ min: 8 })
      .withMessage('needs to be at least 8 characters'),
    check('username')
      .isLength({ min: 4 })
      .withMessage('needs to be at least 4 characters')
  ],
  createUser
)
router.put(
  '/',
  [
    check('password')
      .isLength({ min: 8 })
      .withMessage('needs to be at least 8 characters')
  ],
  updateUser
)
router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('invalid email address')
      .isLength({ min: 8 })
      .withMessage('needs to be at least 8 characters')
      .normalizeEmail()
  ],
  postLogin
)

export default router
