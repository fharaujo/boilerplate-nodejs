import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@infrastructure/database/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    if (process.env.NODE_ENV === 'test') {
      await prisma.cleanDatabase();
    }
  });

  describe('Auth Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };

    it('/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('email', testUser.email);
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('/auth/register (POST) - should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...testUser, email: 'invalid-email' })
        .expect(400);
    });

    it('/auth/login (POST) - should login with valid credentials', async () => {
      // First register user
      await request(app.getHttpServer()).post('/api/v1/auth/register').send(testUser);

      // Then login
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data).toHaveProperty('user');
        });
    });

    it('/auth/login (POST) - should fail with invalid credentials', async () => {
      await request(app.getHttpServer()).post('/api/v1/auth/register').send(testUser);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    let accessToken: string;

    const testUser = {
      email: 'protected@example.com',
      password: 'Password123!',
      name: 'Protected User',
    };

    beforeEach(async () => {
      // Register and login to get token
      await request(app.getHttpServer()).post('/api/v1/auth/register').send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('/users/me (GET) - should get current user profile', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('email', testUser.email);
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('/users/me (GET) - should fail without token', () => {
      return request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
    });
  });
});
