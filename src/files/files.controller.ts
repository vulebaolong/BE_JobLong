import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ResponseMessage('Upload single file')
    uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /^(png|image\/png|pdf|application\/pdf)$/i,
                })
                .addMaxSizeValidator({
                    maxSize: 1024 * 1024, //kb = 1MB
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
    ) {
        return {
            fileName: file.filename
        }
    }

    @Post()
    create(@Body() createFileDto: CreateFileDto) {
        return this.filesService.create(createFileDto);
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

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(+id);
    }
}
