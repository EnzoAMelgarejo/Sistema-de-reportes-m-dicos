import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SyncUserDto } from './dto/sync-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Role } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(dto: SyncUserDto) {
    if (!dto.auth0Id) {
      throw new BadRequestException('auth0Id es requerido');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { auth0Id: dto.auth0Id },
    });

    if (existingUser) return { user: existingUser, created: false };

    const newUser = await this.prisma.user.create({
      data: {
        auth0Id: dto.auth0Id,
        email: dto.email,
        name: dto.name,
        role: dto.role ?? Role.USER,
      },
    });

    return { user: newUser, created: true };
  }

  async findAllActive(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    if (!users.length) {
      throw new NotFoundException('No hay usuarios activos.');
    }

    return users;
  }

  async findAllIsInactive(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: false },
    });

    if (!users.length) {
      throw new NotFoundException('No hay usuarios inactivos.');
    }

    return users;
  }

  async findById(id: number): Promise<User> {
    if (isNaN(id)) {
      throw new BadRequestException('El ID debe ser un número válido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    return user;
  }

  async findByAuht0Id(auth0Id: string): Promise<User> {
    if (!auth0Id || typeof auth0Id !== 'string') {
      throw new BadRequestException('auth0Id inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con auth0Id ${auth0Id} no encontrado.`);
    }

    return user;
  }

  async updateOwnProfile(dto: UpdateUserDto, requester: {auth0Id: string}): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { auth0Id: requester.auth0Id },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const forbiddenFields = ['auth0Id', 'email', 'role'];
    forbiddenFields.forEach((field) => delete (dto as any)[field]);

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: dto.name ?? user.name,
      },
    });
  }


  async updateUsers(id: number, dto: UpdateUserDto, requester: { sub: string; role?: Role }): Promise<User> {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });

    if (!userToUpdate) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const isOwner = userToUpdate.auth0Id === requester.sub;
    const isAdmin = Array.isArray(requester.role)
    ? requester.role.includes(Role.ADMIN)
    : requester.role === Role.ADMIN;


    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Solo puedes modificar tu propio perfil.');
    }

    // Evitar modificaciones no permitidas
    const forbiddenFields = ['auth0Id', 'email', 'password'];
    forbiddenFields.forEach((field) => {
      if (field in dto) {
        delete (dto as any)[field];
      }
    });

    if (!isAdmin && dto.role && dto.role !== userToUpdate.role) {
      throw new ForbiddenException('Solo los administradores pueden cambiar el rol.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name ?? userToUpdate.name,
        role: isAdmin ? dto.role ?? userToUpdate.role : userToUpdate.role,
      },
    });

    return updatedUser;
  }

  async remove(id: number): Promise<User> {
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
  }

  return this.prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

}
