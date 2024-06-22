import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { AuditService } from "./audit-service";
import AuditEventModel from "../models/Event";

const auditService = new AuditService(AuditEventModel);

const clientId: string = "audit-service";
const brokers: string[] = ["localhost:9092"];
const topic: string = "auditLogTopic";

const kafka: Kafka = new Kafka({ clientId, brokers });
const consumer: Consumer = kafka.consumer({ groupId: clientId });


const consume = async (): Promise<void> => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic });

    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        if (message.value) {
          const eventData = JSON.parse(message.value.toString());
          console.log(`Saved event: ${JSON.stringify(eventData)}`);
          if (eventData.data && typeof eventData.data === 'string') {
            eventData.data = JSON.parse(eventData.data as string);
          }

          await auditService.saveEvent(eventData);
          console.log(`Saved event: ${JSON.stringify(eventData)}`);
          console.log(`Saved event: ${JSON.stringify(eventData.data)}`);

        } else {
          throw new Error("Received message with null value");
        }
      },
    });
  } catch (error) {
    console.error(`Error connecting and subscribing to consumer: ${error}`);
  }
};

export { consume };

