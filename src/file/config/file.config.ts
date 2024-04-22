import { registerAs } from '@nestjs/config';
import { FileConfig } from './file-config.type';

// @TODO validation

export default registerAs<FileConfig>('file', () => {
  return {};
});
