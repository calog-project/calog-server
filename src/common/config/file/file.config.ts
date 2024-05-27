import { registerAs } from '@nestjs/config';

// @TODO validation
export type FileConfig = {};

export default registerAs<FileConfig>('file', () => {
  return {};
});
