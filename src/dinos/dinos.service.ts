import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Dino } from './dino.entity';

@Injectable()
export class DinosService extends TypeOrmCrudService<Dino>{
    constructor(@InjectRepository(Dino) repo) {
        super(repo)
    }
}
