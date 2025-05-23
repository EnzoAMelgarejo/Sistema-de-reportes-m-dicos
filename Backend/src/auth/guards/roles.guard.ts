import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./decorators/roles.decorator";
import { Role } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiredRoles || requiredRoles.length === 0){
            return true;
        };
    
        const { user } = context.switchToHttp().getRequest();
              
        if (!user || !user.role) {
          throw new ForbiddenException('No se encontró el rol del usuario');
        }
    
        const userRoles: string[] = user.role; // ya sabemos que es un array: ['USER'], ['ADMIN'], etc.
    
        // Admin tiene acceso a todo
        if (userRoles.includes('ADMIN')) {
          return true;
        }
    
        // Verificar si el usuario tiene al menos uno de los roles requeridos
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
          throw new ForbiddenException(
            `❌ Acceso denegado. Rol del user: [${userRoles}] | Requiere uno de: [${requiredRoles}]`
          );
        }

        
        return true;
    }
}