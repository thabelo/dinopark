import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinosModule } from './dinos/dinos.module';
import { LogsModule } from './logs/logs.module';
import { ZonesModule } from './zones/zones.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '0.0.0.0',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      keepConnectionAlive: true
    }), 
    DinosModule,
    LogsModule, 
    ZonesModule ],
})
export class AppModule {}
