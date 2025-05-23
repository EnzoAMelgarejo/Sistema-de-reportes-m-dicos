import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Roles(Role.USER)
  @Get('me') //Obtiene el usuario logueado
  getCurrentUser(@Req() req) {
    console.log('🧪 req.user:', req.user);
    const auth0Id = req.user.auth0Id;
    return this.userService.findByAuht0Id(auth0Id);
  }
  
  @Roles(Role.USER)
  @Get() //Trae a todos los usuarios activos
  findAllActiveUsers() {
    return this.userService.findAllActive();
  }
  
  @Roles(Role.USER)
  @Get('id/:id') //Obtiene un usuario por su id (Implementado para moverse a traves de la base de datos, sin necesidad del string auth0. Solo usar en el backend)
  findOneById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(+id);
  }
  
  @Roles(Role.ADMIN)
  @Get('auth0/:auth0Id') //Obtiene un usuario por su id de auth0 (Este es el que se usa desde el frontend)
  findOneByAuth0(@Param('auth0Id') auth0Id: string) {
    return this.userService.findByAuht0Id(auth0Id);
  }

  @Roles(Role.ADMIN)
  @Get('inactive') //Trae a todos los usuarios que fueron desactivados mediante un softDelete
  findInactiveUsers() {
    return this.userService.findAllIsInactive();
  }

  @Roles(Role.USER)
  @Patch('me')
  updateOwnProfile(@Body() dto: UpdateUserDto, @Req() req) { 
    const auth0Id = req.user.auth0Id;
    return this.userService.updateOwnProfile(dto, {auth0Id});
  }

  @Roles(Role.ADMIN)
  @Patch('id/:id') //Actualiza datos de usuarios (El rol solo puede ser cambiado por admins. Las contraseñas e emails no pueden cambiarse desde aquí. Esto evita interferencias con los registros de Auth0)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: any): Promise<User> {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.updateUsers(+id, dto, req.user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id') //SoftDelete (Solo descativa los usuarios desde la base de datos, más no interfiere con los registros de Auth0)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
