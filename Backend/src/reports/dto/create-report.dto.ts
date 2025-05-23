import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Priority, Status, Category} from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    @Transform(({value}) => value?.toUpperCase())
    priority: Priority;

    @IsEnum(Status)
    @IsOptional()
    @Transform(({value}) => value?.toUpperCase())
    status?: Status;

    @IsEnum(Category)
    @IsOptional()
    @Transform(({value}) => value?.toUpperCase())
    category?: Category;

    @IsInt()
    authorId: number;

    @IsInt()
    @IsOptional()
    assignedId?: number;

}