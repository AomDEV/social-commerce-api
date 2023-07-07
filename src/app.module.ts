import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { API_MODULES } from '@/config';
import { PrismaService } from '@/common/service/prisma.service';
import { GlobalModule } from '@/common/instances/module/global.module';

@Module({
	imports: [
		GlobalModule,
	].concat(API_MODULES as []),
	controllers: [AppController],
	providers: [
		PrismaService,
	],
})
export class AppModule { }
