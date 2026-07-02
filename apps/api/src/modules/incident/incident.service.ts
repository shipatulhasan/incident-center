import { StatusCodes } from 'http-status-codes'

import AppError from '@/shared/errors/AppError'

import Incident from './incident.model'

import { NotificationService } from '../notification/notification.service'
import { INCIDENT_POPULATE, UPDATEABLE_FIELDS } from './incident.constant'
import { notifyMentionedUsers } from './incident.utils'
import User from '../auth/auth.model'


const createIncident = async (
  payload: ICreateIncidentPayload,
  userId: string
) => {
  const { title, service, description, severity, assignedTo, impact } = payload

  const incident = await Incident.create({
    title,
    service,
    description,
    severity,
    assignedTo: assignedTo || undefined,
    impact: impact ?? '',
    reportedBy: userId,

    timeline: [
      {
        type: 'created',
        message: `Incident created with ${severity ?? 'low'} severity.`,
        author: userId
      }
    ]
  })

  if (assignedTo) {
    await NotificationService.create({
      title: 'New incident assigned',
      message: title,
      targetUser: assignedTo,
      incident: incident._id
    })
  }

  return await Incident.findById(incident._id).populate(INCIDENT_POPULATE)
}

const getIncidents = async (query: IIncidentQuery) => {
  const { status, severity, q } = query

  const filter: Record<string, unknown> = {}

  if (status) {
    filter.status = status
  }

  if (severity) {
    filter.severity = severity
  }

  if (q) {
    filter.$or = [
      {
        title: {
          $regex: q,
          $options: 'i'
        }
      },
      {
        service: {
          $regex: q,
          $options: 'i'
        }
      },
      {
        description: {
          $regex: q,
          $options: 'i'
        }
      }
    ]
  }

  return await Incident.find(filter)
    .sort({
      status: 1,
      severity: -1,
      createdAt: -1
    })
    .populate(INCIDENT_POPULATE)
}

const getIncident = async (incidentId: string) => {
  const incident =
    await Incident.findById(incidentId).populate(INCIDENT_POPULATE)

  if (!incident) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Incident not found.')
  }

  return incident
}

const updateIncident = async (
  incidentId: string,
  payload: IUpdateIncidentPayload,
  userId: string
) => {
  const incident = await Incident.findById(incidentId)

  if (!incident) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Incident not found.')
  }

  const changes: string[] = []

  for (const field of UPDATEABLE_FIELDS) {
    const value = payload[field as keyof IUpdateIncidentPayload]

    if (
      value !== undefined &&
      String(incident.get(field) ?? '') !== String(value ?? '')
    ) {
      changes.push(field)

      incident.set(field, value || undefined)
    }
  }

  if (payload.actionItems) {
    incident.actionItems = payload.actionItems as typeof incident.actionItems
  }

  if (changes.includes('status')) {
    incident.timeline.push({
      type: 'status',
      message: `Status changed to ${incident.status}.`,
      author: userId
    })

    if (incident.status === 'resolved') {
      incident.resolvedAt = new Date()
    } else {
      incident.resolvedAt = undefined
    }
  }

  if (changes.includes('assignedTo') && incident.assignedTo) {
    incident.timeline.push({
      type: 'assignment',
      message: 'Incident assignment changed.',
      author: userId
    })

    await NotificationService.create({
      title: 'Incident assigned to you',
      message: incident.title,
      targetUser: incident.assignedTo,
      incident: incident._id
    })
  }

  if (changes.includes('severity')) {
    incident.timeline.push({
      type: 'severity',
      message: `Severity changed to ${incident.severity}.`,
      author: userId
    })
  }

  await incident.save()

  return await Incident.findById(incident._id).populate(INCIDENT_POPULATE)
}

const addComment = async (
  incidentId: string,
  message: string,
  user: Express.User
) => {
  const incident = await Incident.findById(incidentId)

  if (!incident) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Incident not found.')
  }

  incident.timeline.push({
    type: 'comment',
    message,
    author: user.id
  })

  await incident.save()

  await notifyMentionedUsers({
    message,
    incident,
    author: user
  })

  return await Incident.findById(incident._id).populate(INCIDENT_POPULATE)
}

const deleteIncident = async (incidentId: string) => {
  const incident = await Incident.findByIdAndDelete(incidentId)

  if (!incident) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Incident not found.')
  }

  return null
}

const getStats = async () => {
  const incidents = await Incident.find()

  const resolved = incidents.filter(
    (incident) => incident.status === 'resolved' && incident.resolvedAt
  )

  const mttrs = resolved.map(
    (incident) =>
      (incident.resolvedAt!.getTime() - incident.startedAt.getTime()) / 60000
  )

  const avgMttr =
    mttrs.length > 0
      ? Math.round(mttrs.reduce((a, b) => a + b, 0) / mttrs.length)
      : 0

  const bySeverity = {
    low: incidents.filter((i) => i.severity === 'low').length,

    medium: incidents.filter((i) => i.severity === 'medium').length,

    high: incidents.filter((i) => i.severity === 'high').length,

    critical: incidents.filter((i) => i.severity === 'critical').length
  }

  const byStatus = {
    open: incidents.filter((i) => i.status === 'open').length,

    investigating: incidents.filter((i) => i.status === 'investigating').length,

    resolved: incidents.filter((i) => i.status === 'resolved').length
  }

  const onCall = await User.find({
    isOnCall: true
  }).select('name email team role isOnCall')

  return {
    total: incidents.length,
    avgMttr,
    bySeverity,
    byStatus,
    onCall
  }
}

export const IncidentService = {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  addComment,
  deleteIncident,
  getStats
}
