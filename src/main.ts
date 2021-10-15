import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Dino Park')
    .setDescription('dinopark')
    .setVersion('1.0')
    .addTag('dinos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);
  
  await app.listen(3000);
}
bootstrap();
