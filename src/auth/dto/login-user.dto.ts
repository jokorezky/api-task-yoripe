import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: "123456", description: 'the password' })
    password: string;
}