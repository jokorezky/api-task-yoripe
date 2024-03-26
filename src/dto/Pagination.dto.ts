import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PaginationsDto {
    @ApiProperty({ description: 'Halaman', default: 1, required: false })
    @IsOptional()
    page?: number = 1;

    @ApiProperty({ description: 'Batas item per halaman', default: 10, required: false })
    @IsOptional()
    limit?: number = 10;

    @ApiProperty({ description: 'Filter pencarian berdasarkan nama produk', required: false })
    @IsOptional()
    search?: string;

    @ApiProperty({ description: 'Filter pencarian berdasarkan nama produk', required: false })
    @IsOptional()
    category?: string;
}