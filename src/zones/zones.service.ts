import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Zone } from './zones.entity';

@Injectable()
export class ZonesService extends TypeOrmCrudService<Zone>{
    constructor(@InjectRepository(Zone) repo) {
        super(repo)
    }

    addLocation(data: any) {
        console.log('Data : ', data);
    }

}
