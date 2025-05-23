import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtM2MStrategy } from './jwt-m2m.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [JwtStrategy, JwtM2MStrategy],
    exports: [JwtStrategy, JwtM2MStrategy]
})
export class AuthModule {}
