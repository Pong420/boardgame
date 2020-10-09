import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      exports: [MatchService],
      controllers: [MatchController],
      providers: [
        MatchService,
        { provide: 'GAMES', useValue: [] },
        { provide: 'MONGODB_URI', useValue: '' }
      ]
    }).compile();

    controller = module.get<MatchController>(MatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
