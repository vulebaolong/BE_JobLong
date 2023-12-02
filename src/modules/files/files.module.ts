import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { FirebaseService } from 'src/modules/firebase/firebase.service';

@Module({
    controllers: [FilesController],
    providers: [FilesService, FirebaseService],
    // imports: [
    //     MulterModule.registerAsync({
    //         useClass: MulterConfigService,
    //     }),
    // ],
})
export class FilesModule {}
