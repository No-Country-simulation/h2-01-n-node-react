import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from 'src/types';

export const Roles = (...roles: string[]) => SetMetadata(USER_ROLE, roles);
