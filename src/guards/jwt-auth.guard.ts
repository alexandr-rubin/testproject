import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../config/configuration';
import { UserService } from 'src/user.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private configService: ConfigService<ConfigType>
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      throw new UnauthorizedException()
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY')
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_KEY,
      });
      const user = await this.userService.getUserById(payload.userId)
      request['user'] = { userId: payload.userId, ...user }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }
}

