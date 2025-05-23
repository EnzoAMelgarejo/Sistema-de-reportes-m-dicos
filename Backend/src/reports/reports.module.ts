import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
