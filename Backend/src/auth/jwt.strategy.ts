import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as jwksRsa from 'jwks-rsa'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService) {
          console.log('JwtStrategy initialized');
        super({

            //De donde sacar el token (en Authorization: Bearer)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            //Desactiva la validacion de expuracion del token (opcional)
            ignoreExpiration: false,

            //Algoritmo de Auth0
            algorithms: ['RS256'],

            //Trae automaticamente la clave publica de Auth0
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
            }),

            //Valida que el issuer sea Auth0
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        });
            console.log('JwtStrategy initialized'); 
    }

    async validate(payload: any) {
        console.log('Payload recibido:', payload);
        return {
            auth0Id: payload.sub,
            email: payload["https://myapp.example/email"],
            name: payload["https://myapp.example/name"],
            role: payload["https://myapp.example/roles"] || [], // 👈 Aquí
        };
    }
}