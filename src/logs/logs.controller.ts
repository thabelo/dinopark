import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, CrudRequestInterceptor, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { Log } from './logs.entity';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController implements CrudController<Log>{
    constructor(public service: LogsService) {}
    
    get base(): CrudController<Log> {
        return this;
    }
    
    @ApiOperation({
        summary: "Dino park log feed."
    })
    @UseInterceptors(CrudRequestInterceptor)
    @Get('feed')
    async exportSome(@ParsedRequest() req: CrudRequest) {
        let allLogs = await this.service.find();
        const cleanLogs = this.cleanupObject(allLogs);
        return cleanLogs;
    }

    /**
     * 
     * @param objArray Cleanup object array
     * @returns clean object array without nulls
     */ 
    cleanupObject(objArray) { 
        let newArray = [];       
        for (const obj of objArray) {
            for(var key in obj) { 
                if (!obj[key] || key === 'id') delete obj[key] 
            }
            newArray.push(obj);
        }
        return newArray; 
    }
}