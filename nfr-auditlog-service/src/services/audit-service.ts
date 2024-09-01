import AuditEventModel, { IEvent } from '../models/Event'


export class AuditService {

  private EventModel: typeof AuditEventModel;

  constructor(EventModel: typeof AuditEventModel) {
    this.EventModel = EventModel;
  }
  public async saveEvent(eventData: IEvent): Promise<IEvent> {

    try {
      const event = new this.EventModel(eventData);

      const savedEvent = await event.save();
      return savedEvent;
    }
    catch (error) {
      throw new Error(`Error saving event: ${error}`);
    }
  }

  public async getAllEvents(): Promise<IEvent[]> {
    try {
      const events = await this.EventModel.find({});
      return events;
    } catch (error) {
      throw new Error('Error retrieving events');
    }

  }
  public async getEventById(eventId: string): Promise<IEvent | null> {
    try {
      if (!eventId) {
        throw new Error('Invalid eventId');
      }
      const event = await this.EventModel.findById(eventId);
      return event;
    } catch (error) {
      throw new Error('Error retrieving event');
    }
  }

  public async filterAuditEvents(utilisateur: string, action: string, moduleName: string, entityName: string, startDate?: Date, endDate?: Date): Promise<IEvent[]> {
    const pipeline: any[] = [];

    const matchStage: any = {};

    if (utilisateur) {
      matchStage.utilisateur = utilisateur;
    }

    if (action) {
      matchStage.action = action;
    }

    if (moduleName) {
      matchStage.moduleName = moduleName;
    }

    if (startDate && endDate) {
      matchStage.date = { $gte: startDate, $lte: endDate };
    } else if (endDate) {
      matchStage.date = { $lte: endDate };
    } else if (startDate) {
      matchStage.date = { $gte: startDate };
    }
    if (entityName) {
      matchStage.entityName = entityName
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const result = await AuditEventModel.aggregate(pipeline).exec();

    return result;
  }




}