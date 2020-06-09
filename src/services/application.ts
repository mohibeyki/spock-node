import { DocumentType, mongoose } from '@typegoose/typegoose'
import { Http400Error, Http404Error } from '../errors/http'
import { ApplicationClass, ApplicationModel } from '../models/application'

const updateFields = (application: DocumentType<ApplicationClass>, obj: any): boolean => {
  let updated = false
  if (obj.company && application.company !== obj.company) {
    application.company = obj.company
    updated = true
  }
  if (obj.position && application.position !== obj.position) {
    application.position = obj.position
    updated = true
  }
  if (obj.submissionDate && application.submissionDate !== obj.submissionDate) {
    application.submissionDate = obj.submissionDate
    updated = true
  }
  if (obj.status && application.status !== obj.status) {
    application.status = obj.status
    updated = true
  }
  if (obj.submissionLink && application.submissionLink !== obj.submissionLink) {
    application.submissionLink = obj.submissionLink
    updated = true
  }
  return updated
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
  const result = updateFields(application, body)
  if (!result) {
    throw new Http400Error()
  }
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
