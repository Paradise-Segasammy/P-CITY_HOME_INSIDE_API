import { Module } from '@nestjs/common';
import { MypagesController } from './controllers/mypages.controller';
import { MypagesService } from './services/mypages.service';
import { MypagesRepository } from './repositories/mypages.repository';

@Module({
  controllers: [MypagesController],
  providers: [MypagesService, MypagesRepository],
})
export class MypagesModule {}
