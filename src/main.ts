import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PrismaService } from '@/common/service/prisma.service';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '@/common/middlewares/response.interceptor';

async function bootstrap() {
	const port = process.env.PORT || 3000;
	const app = await NestFactory.create(AppModule);

	// ** Injectable loader
	const prismaService = app.get<PrismaService>(PrismaService);
	await prismaService.enableShutdownHooks(app);

	app.use(json({ limit: '5mb' })); //! 5mb limit
	//? When using `helmet`, `@apollo/server` (4.x), and the Apollo Sandbox,
	//? there may be a problem with CSP on the Apollo Sandbox.
	app.use(helmet({
		crossOriginEmbedderPolicy: false,
		contentSecurityPolicy: false,
	}));
	app.useGlobalPipes(new ValidationPipe);
	app.useGlobalInterceptors(new ResponseInterceptor)
	app.enableVersioning({
		type: VersioningType.URI,
	});

	app.setGlobalPrefix('api');
	const config = new DocumentBuilder()
		.setTitle('eCommerce Connector')
		.setVersion('1.0')
		.addTag('ecommerce-connector')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.enableCors({});
	await app.listen(port, () => console.log(`Server is running on port ${port}`));
}
bootstrap();
