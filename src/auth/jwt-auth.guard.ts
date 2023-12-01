import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // lấy ra giá trị của decorator isPublic
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        // nếu decorator isPublic là true sẽ đi tiếp và không xác thực JWT
        if (isPublic) return true;

        // ngược lại sẽ kiểm tra JWT
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();

        if (err || !user) {
            throw err || new UnauthorizedException('Token is invalid or has no bearer in the header');
        }

        // Check permission
        const targetMethod = request.method;
        const targetEndpoint: string = request.route?.path;

        const permissions: Permission[] = user?.permissions || [];

        const isExist = permissions.find((permission) => {
            return targetMethod === permission.method && targetEndpoint === permission.apiPath;
        });

        if (targetEndpoint.startsWith('/api/v1/auth')) return user;

        if (!isExist) throw new ForbiddenException('You do not have permission to access');

        return user; // @User() user: IUser
    }
}
