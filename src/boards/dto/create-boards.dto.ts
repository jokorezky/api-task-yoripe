import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
    @ApiProperty({ title: 'TODO', description: 'this Title For Board' })
    title: string;
}