import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AllConfigType } from '../../../../../common/config/config.type';
import { FilePort } from '../../../../domain/port/out/file.port';

@Injectable()
export class S3FileAdapter implements FilePort {
  s3Client: S3Client;
  constructor(private readonly _configService: ConfigService<AllConfigType>) {
    this.s3Client = new S3Client({
      region: this._configService.get('file.awsRegion', { infer: true }),
      credentials: {
        accessKeyId: this._configService.get('file.awsAccessKey', {
          infer: true,
        }),
        secretAccessKey: this._configService.get('file.awsSecretKey', {
          infer: true,
        }),
      },
    });
  }

  async saveImage(
    fileName: string,
    file: Express.Multer.File['buffer'],
    ext: string,
  ): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: this._configService.get('file.awsS3BucketName', { infer: true }),
      Key: fileName,
      Body: file,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    const result = await this.s3Client.send(command);
    console.log(result);
    return result;
  }
}
