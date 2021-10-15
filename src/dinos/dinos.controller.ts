import { Body, Controller, HttpException, HttpStatus, Patch, Post, Request, UseInterceptors} from '@nestjs/common';

import {
    Crud,
    CrudController,
    CrudRequest,
    CrudRequestInterceptor,
    Override,
    ParsedRequest,
} from '@nestjsx/crud';

import { Dino } from './dino.entity';
import { DinosService } from './dinos.service';
import { LogsService } from '../logs/logs.service';
import { ZonesService } from '../zones/zones.service';
import { Not } from 'typeorm';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
var moment = require('moment');

@Crud({
    model: {
        type: Dino
    },
    routes: {
        only: ['getOneBase', 'getManyBase', 'createOneBase', 'updateOneBase'],
    }
})

@Controller('dinos')
export class DinosController implements CrudController<Dino> {
    constructor(
        public service: DinosService, 
        private readonly logsService: LogsService, 
        private readonly zonesService: ZonesService
    ) {}
    
    get base(): CrudController<Dino> {
        return this;
    }

    // Swagger code
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                species: { type: 'string' },
                gender: { type: 'string' },
                digestion_period_in_hours: { type: 'integer' },
                herbivore: { type: 'boolean' },
                location:  { type: 'string' },
                park_id: { type: 'integer' }
            },
        },
    })

    /**
     * Create new dino
     */
    @Override()
    async createOne(
        @ParsedRequest() req: CrudRequest,
        @Body() dto: Dino,
    ) {
        const dinoStatus = 'dino_added';

        // Validate grid zone
        this.validateGridZone(dto.location); 

        // Find existing zone to allocate new dino
        let zone = {name: dto.location, kind: dinoStatus, park_id: dto.park_id};
        let zoneData = await this.zonesService.findOne({name: dto.location, park_id: dto.park_id});


        // Validate non-mixed diet in zone
        let differentDietDinosInZone = await this.service.findOne({where: { location: dto.location, herbivore: Not(dto.herbivore) }})

        // Do not allow mixed diet dinos
        if (differentDietDinosInZone) {
            throw new HttpException('Mixed dino diet, please remove current dinos or move to next available zone with same diet', HttpStatus.NOT_ACCEPTABLE);
        }

        // Create new location within grid or update zone kind
        if (!zoneData) {
            this.zonesService.createOne(req, zone);
        } else { 
            zoneData.kind = zone.kind;
            this.zonesService.updateOne(req, zoneData);
        }

        // Add new dino
        let createDino  = await this.base.createOneBase(req, dto);

        let log = { ...{kind: dinoStatus}, ...dto, ...createDino, ...{dinosaur_id: createDino.id}}
 
        // Log activity
        await this.logsService.createOne(req,log);

        // Refactor dino obj

        return ({...createDino, ...{kind: dinoStatus}});
    }

    /**
     * 
     * Delete dino by id 
     * 
     */
    @Override()
    async deleteOne(
      @ParsedRequest() req: CrudRequest,
    ) {
        const dinoStatus = 'dino_removed';

        // Find dino by id
        const dinoId =  req.parsed.paramsFilter[0].value;
        let dinoData = await this.service.findOne({where: {id: dinoId}})

        if (!dinoData)
            throw new HttpException('Dino not found', HttpStatus.NOT_FOUND);

        // Remove dino from DB
        await this.base.deleteOneBase(req);

        // Find dino location
        let zoneData = await this.zonesService.findOne({where: {name: dinoData.location, park_id: dinoData.park_id}})

        // Set base request
        req.parsed.paramsFilter = [];
        req.parsed.search = {};
        
        // Udate zone status
        zoneData.kind = dinoStatus;
        await this.zonesService.updateOne(req, zoneData);

        //Save log data
        let logData =  await this.logsService.createOne(req,{kind: dinoStatus, dinosaur_id: dinoId, park_id: zoneData.park_id });
        let newLogObject = this.cleanupObject(logData);
        delete newLogObject.id;
        return this.cleanupObject(logData);
    }

    // Swagger code
    @ApiOperation({
        summary: "Updates Dino location to a defined zone in the grid."
    })
    @ApiParam({
        name:  'id',
        required: true,
        description: 'Dino id',
        schema: {
            oneOf:[
                {type: 'string' },
                {type: 'integer'}
            ]
        }
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                location: { type: 'string' },
                park_id: { type: 'integer' },
            },
        },
    })

    /**
     * 
    * Update dino location by id 
    */
    @Override('updateOneBase')
    async updateDinoLocationById(
      @ParsedRequest() req: CrudRequest,
      @Body() dto: Dino
    ) {
        this.validateGridZone(dto.location);
        const dinoStatus = 'dino_location_updated';

        // Get seleted dino
        const dinoId =  req.parsed.paramsFilter[0].value;
        let dinoData = await this.service.findOne({where: {id: dinoId}})
        
        if (!dinoData)
            throw new HttpException('Dino not found', HttpStatus.NOT_FOUND);

        // Validate non-mixed diet to destination zone
        let differentDietDinosInZone = await this.service.findOne({where: { location: dto.location, park_id: dto.park_id, herbivore: Not(dinoData.herbivore) }})

        // Do not allow mixed diet dinos
        if (differentDietDinosInZone) {
            throw new HttpException('Mixed dino diet, please remove current dinos or move to next available zone with same diet', HttpStatus.NOT_ACCEPTABLE);
        }

        // Update location
        await this.base.updateOneBase(req, dto);

        // Set base request
        req.parsed.paramsFilter = [];
        req.parsed.search = {};


        // Find dino location
        let zone = {name: dto.location, kind: dinoStatus, park_id: dto.park_id};
        let zoneData = await this.zonesService.findOne({where: {name: dto.location, park_id: dto.park_id}})

        // Create new location within grid or update zone kind
        
        if (!zoneData) {
            this.zonesService.createOne(req, zone);
        } else { 
            zoneData.kind = zone.kind;
            this.zonesService.updateOne(req, zoneData);
        }
        
        // Save log data
        let logData =  await this.logsService.createOne(req,{kind: dinoStatus, location: dto.location, dinosaur_id: dinoId, park_id: dto.park_id });
        let newLogObject = this.cleanupObject(logData);
        delete newLogObject.id;
        return this.cleanupObject(logData);
    }


    // Swagger code
    @ApiOperation({
        summary: "Feed dinos at defined zone in the grid."
    })
    @ApiParam({
        name:  'id',
        required: true,
        description: 'Dino id',
        schema: {
            oneOf:[
                {type: 'string' },
                {type: 'integer'}
            ]
        }
    })

    /**
    * 
    * Update dino location by id 
    */
    @UseInterceptors(CrudRequestInterceptor)
    @Patch('feed/:id')
    async feeDinos(
        @ParsedRequest() req: CrudRequest
    ) {
        const dinoStatus = 'dino_fed';
        const dinoId =  req.parsed.paramsFilter[0].value;
        
        let dinoData = await this.service.findOne({where: {id: dinoId}})
        if (!dinoData)
            throw new HttpException('Dino not found', HttpStatus.NOT_FOUND);

        // Get last time dino was fed
        const dinoFeedLogs = await this.logsService.findOne({where: { dinosaur_id: dinoId, kind: dinoStatus, location: dinoData.location, park_id: dinoData.park_id}, order: {id: 'DESC'}})

        // Check last feed log 
        if (dinoFeedLogs) {
            var startDate = moment(dinoFeedLogs.time);
            var endDate = moment();
            var timeDiffHours = endDate.diff(startDate, 'hours');

            if (timeDiffHours <= dinoData.digestion_period_in_hours)
                throw new HttpException('Dino fed already', HttpStatus.UNAUTHORIZED);
        }

        // Set base request
        req.parsed.paramsFilter = [];
        req.parsed.search = {};

        // Update zone status
        req.options.routes.updateOneBase.returnShallow = true;
        let dinoZone = await this.zonesService.findOne({ where: {name: dinoData.location, park_id: dinoData.park_id}});
        if (!dinoZone)
            throw new HttpException('Invalid zone for dino', HttpStatus.FAILED_DEPENDENCY);

        dinoZone.kind = dinoStatus;
        const updateZone = await this.zonesService.updateOne(req, dinoZone);
        if (updateZone.kind !== dinoStatus)
            throw new HttpException('Feeding status failed.', HttpStatus.FAILED_DEPENDENCY);
        
        // Save log data
        let logData =  await this.logsService.createOne(req,{kind: dinoStatus, location: dinoData.location, dinosaur_id: dinoData.id, park_id: dinoData.park_id });
        let newLogObject = this.cleanupObject(logData);
        delete newLogObject.id;
        return this.cleanupObject(logData);
    }


    // Swagger code
    @ApiOperation({
        summary: "Location maintanance."
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                location: { type: 'string' },
                park_id: { type: 'integer' },
            },
        },
    })

    /**
    * 
    * Zone maintanance
    */
    @UseInterceptors(CrudRequestInterceptor)
    @Post('maintanance')
    async maintanance(
        @ParsedRequest() req: CrudRequest,
        @Body() dto: Dino
    ) {
        const zoneStatus = 'maintenance_performed';

        this.validateGridZone(dto.location);

        let zoneData = await this.zonesService.findOne({where: {name: dto.location, park_id: dto.park_id}})
        if (!zoneData)
            throw new HttpException('Zone not found', HttpStatus.NOT_FOUND);

        // Get last time zone was maintained
        let zoneMaintananceLogs = await this.logsService.findOne({where: { kind: zoneStatus, location: dto.location, park_id: dto.park_id}, order: {id: 'DESC'}})

        // Check last feed log 
        if (zoneMaintananceLogs && zoneMaintananceLogs.time) {
            var startDate = moment(zoneMaintananceLogs.time);
            var endDate = moment();
            var timeDiffDays = endDate.diff(startDate, 'days');

            if (timeDiffDays <= process.env.ZONE_MAINTANACE_INTERVAL)
                throw new HttpException('Zone maintained already', HttpStatus.UNAUTHORIZED);
        }
                    
        // Check canivores 
        let canivores = await this.service.find({where: {location: dto.location, park_id: dto.park_id, herbivore: false}});
        if (canivores) {
            for(var key in canivores) { 
                const canivoreLog = await this.logsService.findOne({where: { dinosaur_id: canivores[key].id ,kind: 'dino_fed', location: dto.location, park_id: dto.park_id}, order: {id: 'DESC'}});
                if (!canivoreLog)
                    throw new HttpException('Dinos are not fed, not safe. Please feed them.', HttpStatus.UNAUTHORIZED);
                
                if (canivoreLog.kind === 'dino_fed') {
                    var startDate = moment(canivoreLog.time);
                    var endDate = moment();
                    var timeDiffHours = endDate.diff(startDate, 'hours');

                    if (timeDiffHours > canivores[key].digestion_period_in_hours)
                        throw new HttpException('Dinos are hungry again, not safe. Please feed them.', HttpStatus.UNAUTHORIZED);
                }
            }         
        }

        // Set base request
        req.parsed.paramsFilter = [];
        req.parsed.search = {};
        
        // Modify zone
        zoneData.kind = zoneStatus;
        req.options.routes.updateOneBase.returnShallow = true;
        const updateZone = await this.zonesService.updateOne(req, zoneData);

        if (updateZone.kind !== zoneStatus)
            throw new HttpException('Maintanace status failed.', HttpStatus.FAILED_DEPENDENCY);
        
        // Save log data
        let logData =  await this.logsService.createOne(req,{kind: zoneStatus, location: zoneData.name, park_id: zoneData.park_id });
        let newLogObject = this.cleanupObject(logData);
        delete newLogObject.id;
        return this.cleanupObject(logData);        
    }

    /**
     * 
     * @param obj Object with possible null values 
     * @returns Object without null values
     */
    cleanupObject(obj) { for(var key in obj){ if (!obj[key]) delete obj[key] } return obj; }

    /**
     * Validate grid parameters
     * @param data String location zone
     * @returns an error if the zone is invaliud
     */
    validateGridZone(data: string) {
        
        // Split characters and numbers
        let splitData = data.split(/([0-9]+)/).filter(Boolean);
       
        // X Axis range
        const minX = "A".charCodeAt(0);
        const maxX = "Z".charCodeAt(0);

        // Y Axis Range
        const minY = 0;
        const maxY = 15;

        if (splitData.length === 2) {
            // Allow lowert case range
            let xChar = splitData[0].toUpperCase().charCodeAt(0);
            if (xChar < minX || xChar > maxX)
                throw new HttpException('X Axis out of grid, please configure grid params.', HttpStatus.NOT_ACCEPTABLE);

            if (parseInt(splitData[1]) < minY || parseInt(splitData[1]) > maxY)
                throw new HttpException('Y Axis out of grid, please configure grid params.', HttpStatus.NOT_ACCEPTABLE);

            return true;
        } else {
            throw new HttpException('Location out of grid', HttpStatus.NOT_ACCEPTABLE);
        }
    }

}

