import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { createUser, deleteUser, updateUser } from '../services/userService';

const clientId: string = "user-service-consumer";
const brokers: string[] = ["localhost:9092"];
const Notification: string = "UserTopic";

const kafka: Kafka = new Kafka({ clientId, brokers });
const consumer: Consumer = kafka.consumer({ groupId: clientId });

const checkRequiredAttributes = (attributes: Record<string, any>, requiredAttributes: string[]): void => {
  const missingAttributes = requiredAttributes.filter(attr => !attributes[attr]);
  if (missingAttributes.length > 0) {
    missingAttributes.forEach(attr => console.error(`Missing ${attr} in event data`));
    throw new Error('Missing required attributes in event data');
  }
};

const consume = async (): Promise<void> => {
  try {
    await consumer.connect();
    console.log('User Consumer connected');
    
    await consumer.subscribe({ topic: Notification });
    console.log(`Consumer subscribed to topic ${Notification}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        console.log(`Received message from topic ${topic}, partition ${partition}`);
        
        if (message.value) {
          try {
            const eventData = JSON.parse(message.value.toString());
            console.log(`Processing event: ${JSON.stringify(eventData)}`);

            switch (eventData.action) {
              case 'addUser':
                const { uuid, userName, firstName, lastName, email, phoneNumber } = eventData;
                checkRequiredAttributes(eventData, ['uuid', 'userName', 'firstName', 'lastName', 'email', 'phoneNumber']);
                await createUser({ uuid, userName, firstName, lastName, email, phoneNumber });
                console.log(`User created successfully from topic ${topic}: ${JSON.stringify(eventData)}`);
                break;

              case 'deleteUser':
                const userIdToDelete = eventData.uuid;
                checkRequiredAttributes(eventData, ['uuid']);
                await deleteUser(userIdToDelete);
                console.log(`User deleted successfully from topic ${topic}: userId ${userIdToDelete}`);
                break;

              case 'updateUser':
                const { uuid: userIdToUpdate, firstName: updatedFirstName, lastName: updatedLastName, email: updatedEmail } = eventData;
                const updatedData = { firstName: updatedFirstName, lastName: updatedLastName, email: updatedEmail };

                
                checkRequiredAttributes({ uuid: userIdToUpdate, ...updatedData }, ['uuid', 'firstName', 'lastName', 'email']);

                await updateUser(userIdToUpdate, updatedData);
                console.log(`User updated successfully from topic ${topic}: ${JSON.stringify(eventData)}`);
                break;

              default:
                throw new Error(`Unsupported action: ${eventData.action}`);
            }
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
