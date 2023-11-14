import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestApplication>(AppModule);

    // config jwt global at the main.ts
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, images
    app.setBaseViewsDir(join(__dirname, '..', 'views'))

    app.useGlobalPipes(new ValidationPipe());

    // config cookies
    app.use(cookieParser());

    // Version APIs
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
    });

    app.enableCors({
        // origin: '*' => cho phép tất cả truy cập
        // origin: true => cho phép cùng domain eg: localhost
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        credentials: true, // FE and BE are both open to exchange cookies
    });

    // swagger
    const config = new DocumentBuilder().setTitle('Cats example').setDescription('The cats API description').setVersion('1.0').addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT);
}
bootstrap();
