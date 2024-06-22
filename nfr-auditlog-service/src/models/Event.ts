import mongoose, {Document,Schema} from 'mongoose';

export interface IEvent extends Document{
  entityName:string;
  entityId:number;
  utilisateur:string;
    action:string;
    date:Date;
    moduleName: string;
    description?:string;
    data?: object;
}

const AuditEventSchema = new Schema<IEvent>({

    entityName: {
        type: String,
        required: true,
      },
    entityId: {
        type: Number,
        required: false,
      },
    action: {
      type: String,
      required: true,
    },
    utilisateur: {
        type: String,
        required: true,
      },
    date: {
        type: Date,
        default: Date.now,
      },
    moduleName: {
        type: String,
        required: true,
      },
    data: {
        type: Object,
        required: false,
      },
    description: {
        type: String,
        required: false,
      },
})
const AuditEventModel = mongoose.model<IEvent>('AuditEvent', AuditEventSchema);

export default AuditEventModel;