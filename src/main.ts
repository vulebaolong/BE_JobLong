import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import helmet from 'helmet';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { useSwagger } from './common/swagger/swagger';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create<NestApplication>(AppModule);

    // config jwt global at the main.ts
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, images
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    // config cookies
    app.use(cookieParser());

    // Version APIs
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
    });

    app.enableCors({
        // origin: '*' => Allow all access
        origin: true, //=> allow same domain eg: localhost
        // origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        credentials: true, // FE and BE are both open to exchange cookies
    });

    app.use(helmet());

    // swagger
    useSwagger(app);

    const port = process.env.PORT;
    await app.listen(port).then(() => {
        logger.verbose(`App is running on http://localhost:${port}`);
    });
}
bootstrap();
