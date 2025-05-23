import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { Role } from 'src/user/entities/user.entity';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {
      console.log('ReportsController constructor');
  }

  @Roles(Role.USER)
  @Post()
  async create(@Body() dto: CreateReportDto, @Req() req) {
      console.log('req.user del reports.Controller:', req.user);
    const userPayload = {
      auth0Id: req.user.auth0Id,
      email: req.user.email,
      name: req.user.name,
    }
    const report = await this.reportsService.create(dto, userPayload);
    return report;
  }

  @Roles(Role.USER)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Roles(Role.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id:number) {
    return this.reportsService.findOne(id);
  }

  @Roles(Role.USER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReportDto, @Req() req) {
    console.log('req.user del reports.Controller:', req.user);
    return this.reportsService.update(id, dto, req.user);
  }

  @Roles(Role.USER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    console.log('req.user del reports.Controller:', req.user);
    return this.reportsService.remove(id, req.user);
  }
}
