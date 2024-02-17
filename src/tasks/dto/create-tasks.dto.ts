import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '../../enums/priority.enum';
import { Status } from '../../enums/status.enum';

export class CreateTaskDto {
    @ApiProperty({ title: 'TODO', description: 'this Title For Task' })
    title: string;

    @ApiProperty({ title: 'Description', description: 'this Title For Task' })
    description: string;

    @ApiProperty({ enum: Priority, default: Priority.Low })
    priority: Priority;

    @ApiProperty({ enum: Status, default: Status.Todo })
    status: Status;

    
}