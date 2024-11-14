import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.query.redirect = 'true';
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('카카오 인증 실패');
    }
    return user;
  }
}
