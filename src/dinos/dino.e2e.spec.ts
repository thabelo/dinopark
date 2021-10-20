import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DinosModule } from '../../src/dinos/dinos.module';
import { DinosService } from '../../src/dinos/dinos.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../../src/logs/logs.module';
import { ZonesModule } from '../../src/zones/zones.module';
import { Dino } from './dino.entity';
import { getConnection } from 'typeorm';
import { Log } from '../../src/logs/logs.entity';
import { Zone } from '../../src/zones/zones.entity';
const axios = require('axios');

describe('Dinos', () => {
    let app: INestApplication;  
    let service: DinosService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
        imports: [ 
            ConfigModule.forRoot(),
                TypeOrmModule.forRoot({
                type: 'postgres',
                host: '0.0.0.0',
                port: 5432,
                username: 'root',
                password: 'root',
                database: 'dinopark_test',
                entities: ['src/**/*{.ts, .js}'],
                keepConnectionAlive: true,
                synchronize: true,
            }),
            DinosModule,
            LogsModule,
            ZonesModule 
        ]
        })
        .overrideProvider(DinosService)
        .useValue(service)
        .compile();

        service = module.get<DinosService>(DinosService);
        app = module.createNestApplication();
        await app.init();
    });

    describe(`/GET dinos`, () => {
        let globalDino: Dino;
        it('Should add new dino to zone', async () => {
            let dinoPostData = { 
                kind: 'dino_added',
                name: 'McGroggity',
                species: 'Tyrannosaurus rex',
                gender: 'male',
                digestion_period_in_hours: 48,
                herbivore: false,
                park_id: 1,
                location: 'A0' 
            };
            const response = await axios.post('http://0.0.0.0:3000/api/dinos', dinoPostData);
            globalDino = response.data;
            expect(dinoPostData.species).toEqual(response.data.species)
        })

        it('Should fail to run maintanance on zone', async () => {
            let maintanancePostData = {
                park_id: 1,
                location: 'A0' 
            };

            try {
                const response = await axios.post('http://0.0.0.0:3000/api/dinos/maintanance', maintanancePostData);
            } catch(error) {
                expect(error.response.data.statusCode).toEqual(401);
                expect(error.response.data.message).toEqual('Dinos are not fed, not safe. Please feed them.');
            }
        })

        it('Should feed the dinos', async () => {
            try {
                const response = await axios.patch('http://0.0.0.0:3000/api/dinos/feed/' + globalDino.id);
                expect(response.data.kind).toEqual('dino_fed');
                expect(response.data.dinasaur_id).toEqual(globalDino.id);
            } catch(error) {
 
            }
        })

        it('Should pass to run maintanance on zone', async () => {
            let maintanancePostData = {
                park_id: 1,
                location: 'A0' 
            };
            const response = await axios.post('http://0.0.0.0:3000/api/dinos/maintanance', maintanancePostData);
            expect(response.data.kind).toEqual('maintenance_performed');
        })
    });

    afterAll(async () => {
        // Cleanup dino table
        await getConnection().createQueryBuilder().delete().from(Dino).execute();        
        // Cleanup log table
        await getConnection().createQueryBuilder().delete().from(Log).execute();        
        // Cleanup zone table
        await getConnection().createQueryBuilder().delete().from(Zone).execute();        
        // Close app
        await app.close();
    });
});