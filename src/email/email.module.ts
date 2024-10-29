import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { EmailService } from './email.service';

import { EMAIL_QUEUE } from '@/common/constant';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
  ],
  providers: [EmailService],
  exports: [BullModule, EmailService],
})
export class EmailModule {}
