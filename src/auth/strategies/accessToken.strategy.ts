import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  handleRequest(err, user, info) {
    if (info && info.expiredAt) {
      throw new UnauthorizedException('Access token has expired');
    }
    if (err || !user) {
      throw new UnauthorizedException('Access token is missing or invalid');
    }
    return user;
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
