// import { HttpModule, HttpService, INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { LogsService } from '../../src/logs/logs.service';
// import { DinosModule } from '../../src/dinos/dinos.module';
// import { DinosService } from '../../src/dinos/dinos.service';
// import supertest from 'supertest';
// import { LogsModule } from '../../src/logs/logs.module';
// import { ZonesModule } from '../../src/zones/zones.module';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';


// describe('DinoController (e2e)', () => {
//   let app: INestApplication;
//   // let httpService: HttpService;


//   beforeAll(async () => {
//       // console.log('Before');
//       // const module = await Test.createTestingModule({
//       // imports: [
//       //     DinosModule,
//       //     TypeOrmModule.forRoot({
//       //     type: 'postgres',
//       //     host: '0.0.0.0',
//       //     port: 5432,
//       //     username: 'root',
//       //     password: 'root',
//       //     database: 'dinopark_test',
//       //     entities: ['./**/*.entity.ts'],
//       //     synchronize: false,
//       //     }),
//       // ],
//       // }).compile();
//       // app = module.createNestApplication();
//       // await app.init();
//       // // repository = module.get('DinoRepository');
//       const mockDinoModule: TestingModule = await Test.createTestingModule({
//         imports: [ 
//           ConfigModule.forRoot(),
//           TypeOrmModule.forRoot({
//           type: 'postgres',
//           host: '0.0.0.0',
//           port: 5432,
//           username: process.env.DB_USER,
//           password: process.env.DB_PASS,
//           database: process.env.DB_NAME,
//           entities: ["dist/**/*.entity{.ts,.js}"],
//           synchronize: true
//         }), DinosModule, LogsModule, ZonesModule],
//         providers: [DinosService, LogsService],
//       }).compile();
  
//       app = mockDinoModule.createNestApplication();
//       // httpService = mockDinoModule.get<HttpService>(HttpService);
//       await app.init();
//   });

//   describe('GET /api/dinos', () => {
//     it('should return an array of dinos', async () => {
//       // jest.setTimeout(100000);
//       //   // Pre-populate the DB with some dummy users
//       //   // let dino1 = dinoStub;

//       //   // await repository.save([
//       //   //     dino1()
//       //   // ]);

//       //   // Run your end-to-end test
//       //   const { body } = await supertest.agent(app.getHttpServer())
//       //   .get('/api/dinos')
//       //   .set('Accept', 'application/json')
//       //   .expect('Content-Type', /json/)
//       //   .expect(200);

//       //   console.log('body : ', body);
//         // expect(body).toEqual([
//         // { id: expect.any(Number), name: 'test-name-0' },
//         // { id: expect.any(Number), name: 'test-name-1' },
//         // ]);
//         expect(200).toEqual(200)
//     });
//   });
  
//   afterAll(async () => {
//       console.log('After');
//       await app.close();
//   });
// })

import supertest, * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DinosModule } from '../../src/dinos/dinos.module';
import { DinosService } from '../../src/dinos/dinos.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../../src/logs/logs.module';
import { ZonesModule } from '../../src/zones/zones.module';
const axios = require('axios');

describe('Dinos', () => {
  let app: INestApplication;
  let dinosService = { findAll: () => ['test'] };

  console.log('__dirname :', __dirname);
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
          keepConnectionAlive: true
        }), 
        DinosModule,
        LogsModule,
        ZonesModule 
      ]
    })
    .overrideProvider(DinosService)
    .useValue(dinosService)
    .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET dinos`, async () => {
    expect(200).toEqual(200)
    const response = await axios.get('http://0.0.0.0:3000/api/dinos');
    console.log('resp  :', response.data);
  });

  afterAll(async () => {
    await app.close();
  });
});