import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KAFKA_SERVICE } from '../common/constant';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}
  async onModuleInit() {
    // Подписка на топик, чтобы получать уведомления
    this.kafkaClient.subscribeToResponseOf('notifications');
    await this.kafkaClient.connect();
  }

  // Отправка уведомления в топик "notifications"
  async sendNotification(data: any) {
    return this.kafkaClient.emit('notifications', data);
  }

  // Получение уведомлений из топика
  async listenToNotifications() {
    this.kafkaClient.subscribeToResponseOf('notifications');
  }
}
