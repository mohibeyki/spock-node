import { mongoose, DocumentType } from '@typegoose/typegoose'
import { Http404Error } from '../errors/http'
import { ApplicationClass, ApplicationModel } from '../models/application'

const updateFields = (application: DocumentType<ApplicationClass>, obj: any) => {
  if (obj.company) {
    application.company = obj.company
  }
  if (obj.position) {
    application.position = obj.position
  }
  if (obj.submissionDate) {
    application.submissionDate = obj.submissionDate
  }
  if (obj.status) {
    application.status = obj.status
  }
  if (obj.submissionLink) {
    application.submissionLink = obj.submissionLink
  }
}

export const getAllApplications = async () => {
  return await ApplicationModel.find().populate('user')
}

export const getApplicationsForUser = async (user: mongoose.Types.ObjectId) => {
  return await ApplicationModel.find({ user, archived: false })
}

export const createApplication = async (
  body: ApplicationClass,
  user: mongoose.Types.ObjectId
) => {
  return await ApplicationModel.create({ ...body, user })
}

export const updateApplication = async (
  applicationId: string,
  body: any,
  user: mongoose.Types.ObjectId
) => {
  const application = await ApplicationModel.findOne({ _id: applicationId, user: user })
  if (!application) {
    throw new Http404Error()
  }
  updateFields(application, body)
  return await application.save()
}

export const deleteApplication = async (
  applicationId: string,
  user: mongoose.Types.ObjectId
) => {
  const application = await ApplicationModel.findOne({ _id: applicationId, user: user })
  if (!application) {
    throw new Http404Error()
  }
  application.archived = true
  return await application.save()
}
