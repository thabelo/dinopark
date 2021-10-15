import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Zone } from './zones.entity';
import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController implements CrudController<Zone>{
    constructor(public service: ZonesService) {}
}
