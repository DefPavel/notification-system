import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { NotificationController } from './notification.controller';

import { EMAIL_QUEUE } from '@/common/constant';
import { EmailModule } from '@/email/email.module';
import { EmailQueueProcessor } from '@/email/email-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
    EmailModule,
  ],
  controllers: [NotificationController],
  providers: [EmailQueueProcessor],
})
export class NotificationModule {}
