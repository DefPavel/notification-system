import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { EmailService } from '../email/email.service';
import { EMAIL_QUEUE } from '@/common/constant';

/**
 * Обработчик очереди для отправки email уведомлений.
 *
 * @class
 * @extends {Processor}
 * @param {string} EMAIL_QUEUE - Имя очереди для обработки email уведомлений.
 */
@Processor(EMAIL_QUEUE)
export class EmailQueueProcessor {
  constructor(private readonly emailService: EmailService) {}
  /**
   * Обрабатывает задания из очереди email уведомлений.
   *
   * @param {Job<{ to: string; subject: string; text: string }>} job - Задание, содержащее данные для отправки email.
   * @returns {Promise<void>} - Обещание, которое разрешается, когда email отправлен.
   */
  @Process()
  async handleEmailQueue(
    job: Job<{ to: string; subject: string; text: string }>,
  ): Promise<void> {
    await this.emailService.sendEmail(
      job.data.to,
      job.data.subject,
      job.data.text,
    );
    console.log('Email sent to:', job.data.to);
  }
}
