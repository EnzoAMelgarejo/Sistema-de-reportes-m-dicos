import { Module } from '@nestjs/common';
import { M2MController } from './m2m.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, UserModule],
  controllers: [M2MController],
})
export class M2MModule {}
