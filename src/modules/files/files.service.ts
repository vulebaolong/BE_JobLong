import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
    create(createFileDto: CreateFileDto) {
        return `${createFileDto}This action adds a new file`;
    }

    findAll() {
        return `This action returns all files`;
    }

    findOne(id: number) {
        return `This action returns a #${id} file`;
    }

    update(id: string, updateFileDto: UpdateFileDto) {
        return `This action updates a #${id} ${updateFileDto}file`;
    }

    remove(name: string) {
        return `This action removes a #${name} file`;
    }
}
