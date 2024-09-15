import { registerAs } from '@nestjs/config';

// @TODO validation
export type FileConfig = {
  awsRegion: string;
  awsS3BucketName: string;
  awsAccessKey: string;
  awsSecretKey: string;
};

export default registerAs<FileConfig>('file', () => {
  return {
    awsRegion: process.env.AWS_REGION,
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
    awsAccessKey: process.env.AWS_ACCESS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
});
