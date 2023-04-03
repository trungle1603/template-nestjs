import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId } from 'class-validator';

export class StreamGridFsFile {
    @ApiProperty()
    @IsDefined()
    @IsMongoId()
    id: string;

    @ApiProperty()
    download = false;
}
