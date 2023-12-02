import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import helmet from 'helmet';
import { SwaggerTheme } from 'swagger-themes';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { configSwagger } from './swagger/config.swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestApplication>(AppModule);

    // config jwt global at the main.ts
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, images
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

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
        origin: true, //=> cho phép cùng domain eg: localhost
        // origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        credentials: true, // FE and BE are both open to exchange cookies
    });

    app.use(helmet());

    // swagger
    const { config } = configSwagger();
    const document = SwaggerModule.createDocument(app, config);
    const theme = new SwaggerTheme('v3');
    const options = {
        explorer: true,
        customCss: theme.getBuffer('dark'),
        swaggerOptions: {
            persistAuthorization: true,
        },
    };
    SwaggerModule.setup('swagger', app, document, options);

    await app.listen(process.env.PORT);
}
bootstrap();
