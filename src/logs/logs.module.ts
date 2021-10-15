import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsController } from './logs.controller';
import { Log } from './logs.entity';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService]
})
export class LogsModule {}
