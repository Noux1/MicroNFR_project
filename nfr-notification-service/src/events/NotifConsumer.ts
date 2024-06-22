import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { createNewNotification } from '../services/notificationService';

const clientId: string = "notifications-consumer";
const brokers: string[] = ["localhost:9092"];
const Notification: string = "NotificationTopic";

const kafka: Kafka = new Kafka({ clientId, brokers });
const consumer: Consumer = kafka.consumer({ groupId: clientId });

const consume = async (): Promise<void> => {
  try {
    await consumer.connect();
    console.log('notif Consumer connected');
    
    await consumer.subscribe({ topic: Notification });
    console.log(`Consumer subscribed to topic ${Notification}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        console.log(`Received message from topic ${topic}, partition ${partition}`);
        
        if (message.value) {
          try {
            const eventData = JSON.parse(message.value.toString());
            const { uuid, notificationChannel, subject, body, time,utilisateur } = eventData;
            if (!uuid || !notificationChannel || !subject || !body || !time) {
              throw new Error('Missing required attributes in create notification event data');
            }

            // Parse the date string into a Date object
            const parsedTime = new Date(time);
            if (isNaN(parsedTime.getTime())) {
              throw new Error('Invalid date format in create notification event data');
            }

            await createNewNotification(uuid, notificationChannel, subject, body, parsedTime,utilisateur);
            console.log(`Notification created successfully from topic ${topic}: ${JSON.stringify(eventData)}`);
          } catch (error) {
            console.error(`Error processing message from topic ${topic}: ${error}`);
          }
        } else {
          console.error(`Received message with null value from topic ${topic}`);
        }
      },
    });
  } catch (error) {
    console.error(`Error connecting and subscribing to consumer: ${error}`);
  }
};

export { consume };
