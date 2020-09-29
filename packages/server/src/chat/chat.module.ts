import { DynamicModule, Module } from '@nestjs/common';
import { MatchModule, MatchModuleOptions } from '@/match/match.module';
import { ChatGateway } from './chat.gateway';
import { memeoryStorageProviders } from './memeory.providers';

@Module({})
export class ChatModule {
  static forRoot(options: MatchModuleOptions): DynamicModule {
    return {
      module: ChatModule,
      imports: [MatchModule.forRoot(options)],
      providers: [ChatGateway, ...memeoryStorageProviders]
    };
  }
}
