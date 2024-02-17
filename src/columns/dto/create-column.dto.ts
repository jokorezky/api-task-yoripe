import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
    @ApiProperty({ title: 'TODO', description: 'this Title For Column' })
    title: string;
}