import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server-global';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule, setupApp } from './../src/app.module';
import * as request from 'supertest';
import { MatchService } from '@/match/match.service';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  const mongod = new MongoMemoryServer({ autoStart: false });
  const gameName = 'gameName';

  beforeAll(async () => {
    await mongod.start();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  beforeEach(async () => {
    const mongoUri = await mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.init({ games: [{ name: gameName }], mongoUri })]
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    setupApp(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
    await app.get(MatchService).disconnect();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/match/${gameName}?name=${gameName}`)
      .expect(200)
      .expect({ matches: [] });
  });
});
