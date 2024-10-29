import { Test, TestingModule } from '@nestjs/testing';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import request = require('supertest');
import { Queue } from 'bull';

import { NotificationController } from './notification.controller';

import { EMAIL_QUEUE, KAFKA_SERVICE } from '@/common/constant';

describe('NotificationController (e2e)', () => {
  let app: INestApplication;
  let emailQueue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: EMAIL_QUEUE,
        }),
      ],
      controllers: [NotificationController],
      providers: [
        {
          provide: KAFKA_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: getQueueToken(EMAIL_QUEUE),
          useValue: {
            add: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    emailQueue = moduleFixture.get<Queue>(getQueueToken(EMAIL_QUEUE));
  });

  afterAll(async () => {
    await app.close();
  });

  it('/notifications/send-email (POST) should add a job to the email queue', async () => {
    const response = await request(app.getHttpServer())
      .post('/notifications/send-email')
      .send({
        to: 'user@example.com',
        subject: 'Welcome!',
        text: 'Thanks for joining us!',
      })
      .expect(201);

    // Проверка ответа
    expect(response.body).toEqual({
      message: 'Notification queued successfully',
    });

    // Проверка добавления задачи в очередь
    expect(emailQueue.add).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Welcome!',
      text: 'Thanks for joining us!',
    });
  });
});
