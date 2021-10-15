import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Log } from './logs.entity';

@Injectable()
export class LogsService extends TypeOrmCrudService<Log>{
    constructor(@InjectRepository(Log) repo) {
        super(repo)
    }
}
