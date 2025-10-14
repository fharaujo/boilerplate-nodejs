import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: Connection;
  private channel: Channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const url = this.configService.get('RABBITMQ_URL', 'amqp://localhost:5672');
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();

      this.connection.on('error', (error) => {
        this.logger.error('RabbitMQ connection error:', error);
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed');
      });

      this.logger.log('RabbitMQ connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.logger.log('RabbitMQ disconnected');
  }

  async publish(queue: string, message: any): Promise<boolean> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
    } catch (error) {
      this.logger.error(`Failed to publish message to queue ${queue}:`, error);
      throw error;
    }
  }

  async consume(queue: string, callback: (message: any) => Promise<void>): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.prefetch(1);

      this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error('Error processing message:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      this.logger.log(`Started consuming from queue: ${queue}`);
    } catch (error) {
      this.logger.error(`Failed to consume from queue ${queue}:`, error);
      throw error;
    }
  }

  getChannel(): Channel {
    return this.channel;
  }
}
