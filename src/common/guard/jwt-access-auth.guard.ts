import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export class JwtAccessAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (err || !user) {
      throw err || new UnauthorizedException('토큰 인증 실패');
    }
    if (req.body && req.body.userId) {
      if (req.body.userId !== user)
        throw new ForbiddenException('비정상적인 접근');
    }
    return user;
  }
}
