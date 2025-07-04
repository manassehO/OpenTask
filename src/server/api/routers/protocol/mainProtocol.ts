import { t } from '~/server/api/trpc';
import { userProtocol } from './userProtocol';

export const mainProtocol = t.router({
  user: userProtocol,
});
