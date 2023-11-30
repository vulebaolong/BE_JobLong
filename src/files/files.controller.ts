import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly firebaseService: FirebaseService,
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ResponseMessage('Upload single file')
    create(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
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
        return this.firebaseService.upload(file, folder);
    }

    @Get()
    findAll() {
        return this.filesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        return this.filesService.update(id, updateFileDto);
    }

    @Delete()
    remove(@Body('name') name: string) {
        return this.firebaseService.remove(name);
    }
}
