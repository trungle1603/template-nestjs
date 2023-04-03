import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/dist';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet, { HelmetOptions } from 'helmet';

import { AppModule } from './app.module';
import { appConfig, AppConfig } from '@common/config/config.app';
import { cookieConfig, CookieConfig } from '@common/config/config.cookie';
import { CSP_LANDING_PAGE } from '@common/constants/csp-landing-page.constant';
import { getHttpsCert } from '@common/utils/get-https-cert';

async function bootstrap() {
    // Config HTTPS server
    const httpsOptions = await getHttpsCert();
    // Init server
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
        httpsOptions,
    });

    // Get environment
    const { port, url, isDevelopment, globalPrefix } = app.get<AppConfig>(
        appConfig.KEY,
    );
    const cookieEnv = app.get<CookieConfig>(cookieConfig.KEY);
    const helmetOpts: HelmetOptions | undefined = isDevelopment
        ? {
              contentSecurityPolicy: {
                  directives: CSP_LANDING_PAGE.PLAYGROUND,
              },
              crossOriginEmbedderPolicy: false,
          }
        : undefined;

    app.set('trust proxy', isDevelopment); // trust 'X-Forwarded-For' headers
    app.enableShutdownHooks(); // ensure that the application shuts down cleanly
    // app.enableCors();

    app.use(helmet(helmetOpts));
    app.use(compression());
    app.use(cookieParser(cookieEnv.signature));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true,
            skipMissingProperties: true,
        }),
    );

    app.setGlobalPrefix(globalPrefix);
    const swaggerOptions = new DocumentBuilder()
        .setTitle('Base API')
        .setDescription('API documentation for Base')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const swaggerDocumentation = SwaggerModule.createDocument(
        app,
        swaggerOptions,
    );
    SwaggerModule.setup(`${globalPrefix}/doc`, app, swaggerDocumentation, {
        swaggerOptions: {
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });

    await app.listen(port, () => {
        const msg = 'App running at ';
        let appUrl = `http://${url}/graphql`;

        if (httpsOptions) {
            appUrl = appUrl.replace('http', 'https');
        }
        console.log(msg + appUrl);
    });
}
bootstrap();
