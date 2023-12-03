import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Permission, PermissionSchema } from '../permissions/schemas/permission.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schema';

@Module({
    controllers: [DatabasesController],
    providers: [DatabasesService],
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Permission.name, schema: PermissionSchema },
            { name: Role.name, schema: RoleSchema },
        ]),
    ],
})
export class DatabasesModule {}
