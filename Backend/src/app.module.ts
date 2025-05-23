import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportsModule } from './reports/reports.module';
import { UserModule } from './user/user.module';
import { AttachmentModule } from './attachment/attachment.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { M2MModule } from './auth/m2m/m2m.module';

@Module({
  imports: [ReportsModule, UserModule, AttachmentModule, PrismaModule, AuthModule, M2MModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
