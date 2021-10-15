import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../logs/logs.entity';
import { LogsModule } from '../logs/logs.module';
import { Zone } from '../zones/zones.entity';
import { ZonesModule } from '../zones/zones.module';
import { Dino } from './dino.entity';
import { DinosController } from './dinos.controller';
import { DinosService } from './dinos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dino]), TypeOrmModule.forFeature([Log]), TypeOrmModule.forFeature([Zone]), LogsModule, ZonesModule],
  controllers: [DinosController],
  providers: [DinosService],
})
export class DinosModule {}
