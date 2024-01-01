import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FirebaseService } from '../../modules/firebase/firebase.service';
// import { MulterModule } from '@nestjs/platform-express';
// import { MulterConfigService } from './multer.config';

@Module({
    controllers: [FilesController],
    providers: [FilesService, FirebaseService],
    exports: [FilesService],
    // imports: [
    //     MulterModule.registerAsync({
    //         useClass: MulterConfigService,
    //     }),
    // ],
})
export class FilesModule {}
