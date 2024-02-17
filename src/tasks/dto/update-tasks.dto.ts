import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '../../enums/priority.enum';
import { Status } from '../../enums/status.enum';

export class UpdateTaskDto {
    @ApiProperty({ title: 'TODO', description: 'This Title For Task' })
    title?: string | null;

    @ApiProperty({ title: 'Description', description: 'This Description For Task' })
    description?: string | null;

    @ApiProperty({ enum: Priority, default: Priority.Low })
    priority?: Priority | null;

    @ApiProperty({ enum: Status, default: Status.Todo })
    status?: Status | null;
}