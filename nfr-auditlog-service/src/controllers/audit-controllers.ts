import { Request, Response } from 'express';
import AuditEventModel, { IEvent } from '../models/Event'

import { AuditService } from '../services/audit-service';

const auditService = new AuditService(AuditEventModel);



export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await auditService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const eventId = req.params.eventId;
  if (!eventId) {
    res.status(400).json({ error: 'Invalid eventId' });
    return;
  }
  try {
    const event = await auditService.getEventById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const filterAuditEvents = async (req: Request, res: Response): Promise<void> => {
  const { utilisateur, action, moduleName, startDate, endDate, entityName } = req.query;


  // Convert startDate and endDate strings to Date objects
  const startDateObj = startDate ? new Date(startDate as string) : undefined;
  const endDateObj = endDate ? new Date(endDate as string) : undefined;

  try {
    const filteredEvents = await auditService.filterAuditEvents(utilisateur as string, action as string, moduleName as string, entityName as string, startDateObj, endDateObj);
    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while filtering audit events.' });
  }
}


