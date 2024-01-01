import {
    Controller,
    Post,
    Body,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseFilePipeBuilder,
    HttpStatus,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../modules/firebase/firebase.service';
import { TAG_MODULE_FILES } from '../../common/contants/swagger.contants';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags(TAG_MODULE_FILES)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ResponseMessage('Upload single file')
    upload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    /**
                     * allow types
                     *  png (type/mimetype): png|image\/png
                     *  jpg (type/mimetype): jpg|image\/jpeg
                     */
                    fileType: /^(png|image\/png|jpg|image\/jpeg)$/i,
                })
                .addMaxSizeValidator({
                    maxSize: 1024 * 1024, //kb = 1MB
                    message: 'Size must be less than 1mb',
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,

        @Body('folder') folder: string,
    ) {
        return this.filesService.upload(file, folder);
    }

    @Delete()
    remove(@Body('name') name: string) {
        return this.filesService.remove(name);
    }
}
