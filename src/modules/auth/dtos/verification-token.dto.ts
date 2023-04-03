import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsJWT } from 'class-validator';

export class VerificationTokenDto {
    @ApiProperty()
    @IsDefined()
    @IsJWT()
    token: string;
}
