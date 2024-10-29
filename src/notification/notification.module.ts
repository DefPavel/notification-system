import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KAFKA_SERVICE } from '../common/constant';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'email-consumer',
          },
        },
      },
    ]),
    EmailModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [ClientsModule],
})
export class NotificationModule {}
