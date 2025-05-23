import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Role } from 'src/user/entities/user.entity';

interface Auth0Payload {
  auth0Id: string;
  email: string;
  name: string;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateReportDto, userPayload: Auth0Payload) {
    if (!userPayload?.auth0Id) {
      throw new UnauthorizedException(
        'No se pudo verificar el usuario autenticado.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { auth0Id: userPayload.auth0Id },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado. Asegúrate que el login se sincronizó correctamente.',
      );
    }

    try {
      return await this.prisma.report.create({
        data: {
          title: dto.title,
          content: dto.content,
          priority: dto.priority,
          category: dto.category,
          status: dto.status,
          authorId: user.id,
          assignedId: dto.assignedId,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'El usuario asignado no existe o no es válido.',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        author: true,
        assignee: true,
        attachments: true,
      },
    });
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        author: true,
        assignee: true,
        attachments: true,
      },
    });

    if (!report) {
      throw new NotFoundException(
        `El reporte ${id} que estás buscando no fue encontrado.`,
      );
    }

    return report;
  }

  async update(id: number, data: UpdateReportDto, userPayload: Auth0Payload) {
    if (!userPayload?.auth0Id) {
      throw new UnauthorizedException(
        'No se pudo verificar el usuario autenticado.',
      );
    }

    const report = await this.prisma.report.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException(
        `El reporte ${id} que estás buscando no fue encontrado.`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { auth0Id: userPayload.auth0Id },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isOwner = report.authorId === user.id;
    const isAdmin = user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        `No tienes permiso para modificar este reporte.`,
      );
    }


    return this.prisma.report.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userPayload: Auth0Payload) {
    if (!userPayload?.auth0Id) {
      throw new UnauthorizedException(
        'No se pudo verificar el usuario autenticado.',
      );
    }

    const report = await this.prisma.report.findUnique({ where: { id } });

    if (!report) {
      throw new NotFoundException(
        `El reporte ${id} que estás buscando no fue encontrado.`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { auth0Id: userPayload.auth0Id },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isOwner = report.authorId === user.id;
    const isAdmin = user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        `No tienes permiso para modificar este reporte.`,
      );
    }

    await this.prisma.report.delete({
      where: { id },
    });

    return { message: `Reporte ${id} eliminado correctamente.` };
  }
}
