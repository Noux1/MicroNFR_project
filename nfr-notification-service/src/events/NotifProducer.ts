import { Kafka, Producer, Partitioners } from "kafkajs";

interface NotificationEventData {
  utilisateur: string;
  entityName: string;
  entityId?: number;
  action: string;
  date: Date;
  moduleName: string;
  description: string;
}

export class NotifProducer {
  private producer: Producer;
  private topic: string;

  constructor(topic: string) {
    this.topic = topic;

    const kafka = new Kafka({
      clientId: 'ms-notification',
      brokers: ['localhost:9092'],
    });
    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async produce(eventData: NotificationEventData) {
    try {
      await this.producer.connect();
      
      await this.producer.send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(eventData) }],
      });

      console.log(`Notification event sent successfully ${this.topic}`);
       
    } catch (error) {
      console.error('Error producing notification event:', error);
      throw new Error('Failed to produce notification event');
    } finally {
      await this.producer.disconnect();
    }
  }
}












