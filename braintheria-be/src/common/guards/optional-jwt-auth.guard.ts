import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Auth Guard
 * - If token is valid: sets req.user with user info (isAuthor can work)
 * - If no token or invalid: allows request but req.user is undefined
 *
 * Use this for public endpoints where auth is optional (viewing questions, search, etc.)
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Call parent canActivate, but don't throw if it fails
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // Don't throw on error - just return undefined user
    // This allows unauthenticated access while still populating user if token exists
    return user || null;
  }
}
