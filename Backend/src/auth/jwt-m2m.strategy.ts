import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as JwksRsa from 'jwks-rsa'

@Injectable()
export class JwtM2MStrategy extends PassportStrategy(Strategy, 'm2m-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: ['RS256'],
            
            secretOrKeyProvider: JwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
            }),
        })
    }

    validate(payLoad: any) {
        console.log('m2mStrategy', payLoad);
        return payLoad;
    }
}