import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsOptional, IsInt, IsEnum, IsString } from 'class-validator';
import { Priority, Category, Status } from '@prisma/client';

export class UpdateReportDto extends PartialType(CreateReportDto) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsEnum(Category)
    categoty?: Category;

    @IsOptional()
    @IsInt()
    authorId?: number;

    @IsOptional()
    @IsInt()
    assignedId?: number;

}

