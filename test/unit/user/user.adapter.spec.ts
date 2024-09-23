import { S3FileAdapter } from 'src/user/infra/out/file/adapter/s3-file.adapter';
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('S3FileAdapter', () => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  let s3FileAdapter: S3FileAdapter;
  let configServiceMock: ConfigService;

  beforeEach(() => {
    configServiceMock = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'file.awsS3BucketName':
            return process.env.AWS_S3_BUCKET_NAME;
          case 'file.awsRegion':
            return process.env.AWS_REGION;
          case 'file.awsAccessKey':
            return process.env.AWS_ACCESS_KEY_ID;
          case 'file.awsSecretKey':
            return process.env.AWS_SECRET_ACCESS_KEY;
          default:
            return null;
        }
      }),
    } as any;

    s3FileAdapter = new S3FileAdapter(configServiceMock);
  });

  it('S3 버킷 이미지 업로드', async () => {
    const key = 'test-image.png';

    const filePath = path.resolve(__dirname, `../${key}`);
    const fileContent = readFileSync(filePath);
    const result = await s3FileAdapter.saveImage(
      key.split('.')[0],
      fileContent,
      key.split('.')[1],
    );
    expect(result.ETag).toBeDefined();
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key.split('.')[0],
    });
    const getObjectResult = await s3FileAdapter.s3Client.send(getCommand);
    expect(getObjectResult).toBeDefined();

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key.split('.')[0],
    });

    await s3FileAdapter.s3Client.send(deleteCommand);
  });
});
