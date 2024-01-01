import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPayloadToken } from '../auth.interface';
import { UsersService } from '../../../modules/users/users.service';
import { PermissionsService } from '../../../modules/permissions/permissions.service';
import { IUser } from '../../../modules/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private usersService: UsersService,
        private permissionsService: PermissionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: IPayloadToken) {
        const user: IUser = (await this.usersService.findOne(payload._id)).toObject();
        const permissions = await this.permissionsService.findAllByUser(user);
        const reuslt = {
            ...user,
            permissions: permissions,
        };
        return reuslt;
    }
}
