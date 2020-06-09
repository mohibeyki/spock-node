import { DocumentType } from '@typegoose/typegoose'
import jwt from 'jsonwebtoken'
import { Http404Error, Http409Error } from '../errors/http'
import { UserClass, UserModel } from '../models/user'
import { checkPassword, hashPassword } from '../util/auth'
import { Role } from '../util/role'
import { JWT_SECRET } from '../util/secrets'

const filterUser = (user: DocumentType<UserClass>) => {
  const { _id, role, username, email } = user
  return { _id, role, username, email }
}

export const getAllUsers = async () => {
  return (await UserModel.find()).map((user) => filterUser(user))
}

const getUserAndToken = (user: DocumentType<UserClass>) => {
  return {
    user: filterUser(user),
    token: jwt.sign(filterUser(user), JWT_SECRET, { expiresIn: '7d' })
  }
}

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const found = await Promise.all([
    UserModel.findOne({ username }),
    UserModel.findOne({ email })
  ])

  if (found[0] || found[1]) {
    throw new Http409Error('A user with the same username or email exists')
  }
  password = await hashPassword(password)

  return getUserAndToken(
    await UserModel.create({
      username,
      email,
      password,
      role: username === 'admin' ? Role.admin : Role.user
    })
  )
}

export const updateUser = async (
  password: string,
  email: string
) => {
  const user = await UserModel.findOne({ email })
  user.password = await hashPassword(password)
  await user.save()
  return { msg: 'ok' }
}

export const signin = async (email: string, password: string) => {
  const user = await UserModel.findOne({
    email
  })

  if (user && (await checkPassword(password, user.password))) {
    return getUserAndToken(user)
  }
  throw new Http404Error('invalid username or password')
}
