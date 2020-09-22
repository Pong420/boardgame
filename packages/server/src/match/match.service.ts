import { Injectable } from '@nestjs/common';
import { MongoStore } from 'bgio-mongo';

@Injectable()
export class MatchService extends MongoStore {}
