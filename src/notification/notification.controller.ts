import { Controller, Post, Body, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ClientKafka } from '@nestjs/microservices';

import { EMAIL_QUEUE, KAFKA_SERVICE } from '@/common/constant';

/**
 * Контроллер для обработки уведомлений.
 */
@Controller('notifications')
export class NotificationController {
  constructor(
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Обрабатывает POST запрос для отправки email уведомлений.
   *
   * @param {string} to - Адрес получателя email.
   * @param {string} subject - Тема email уведомления.
   * @param {string} text - Текст email уведомления.
   * @returns {Promise<{ message: string }>} - Обещание, которое возвращает сообщение о статусе очереди.
   */
  @Post('send-email')
  async sendEmailNotification(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ): Promise<{ message: string }> {
    // Публикуем событие в Kafka
    const notification = { to, subject, text };
    this.kafkaClient.emit('email_notifications', notification);

    // Добавляем в очередь Bull
    await this.emailQueue.add(notification);
    return { message: 'Notification queued successfully' };
  }
}
