import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesController } from './zones.controller';
import { Zone } from './zones.entity';
import { ZonesService } from './zones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Zone])],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService]
})
export class ZonesModule {}