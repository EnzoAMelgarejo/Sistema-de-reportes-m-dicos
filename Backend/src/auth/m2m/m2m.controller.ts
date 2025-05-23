import { Res, Body, Controller, Post, Req } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { UseGuards } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { SyncUserDto } from "src/user/dto/sync-user.dto";
import { Role } from "src/user/entities/user.entity";

@Controller('m2m')
@UseGuards(AuthGuard('m2m-jwt'))
export class M2MController {
  constructor(private readonly userService: UserService) {}

@Post('sync')
async syncUser(@Req() req, @Body() dto: SyncUserDto, @Res() res: Response) {
  const roles: string[] = req.user?.['https://myapp.example/roles'] || [];

  // Tomar el primer rol (o ajustar si esperás múltiples roles)
  const role = roles.includes('ADMIN') ? Role.ADMIN : Role.USER;

  const { user, created } = await this.userService.findOrCreate({
    ...dto,
    role,
  });

  return res.status(created ? 201 : 200).json({
    message: created ? 'User created' : 'User already exists',
    user,
  });
}
}
