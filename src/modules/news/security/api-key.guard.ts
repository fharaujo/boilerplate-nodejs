import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly requiredKey = '21534289a37349d6a3cdc0c426f8aa67';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey: string | undefined = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing x-api-key header');
    }

    if (apiKey !== this.requiredKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
