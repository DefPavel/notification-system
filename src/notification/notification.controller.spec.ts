import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { Queue } from 'bull';

describe('NotificationController (e2e)', () => {
  let app: INestApplication;
  let emailQueue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'emailQueue',
        }),
      ],
      controllers: [NotificationController],
      providers: [
        {
          provide: 'KAFKA_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: getQueueToken('emailQueue'),
          useValue: {
            add: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    emailQueue = moduleFixture.get<Queue>(getQueueToken('emailQueue'));
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
