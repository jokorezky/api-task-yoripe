import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from "../../types/role.type"

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    full_name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: "123456", description: 'the password' })
    password?: string;

    @ApiProperty({ example: "123456", description: 'the password' })
    roles: RoleType;
}