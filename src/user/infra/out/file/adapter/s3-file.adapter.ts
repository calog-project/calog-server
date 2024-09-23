import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllConfigType } from '../../../../../common/config/config.type';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FilePort } from '../../../../domain/port/out/file.port';

@Injectable()
export class S3FileAdapter implements FilePort {
  s3Client: S3Client;
  bucketName: string;
  region: string;
  constructor(private readonly _configService: ConfigService<AllConfigType>) {
    this.bucketName = this._configService.get('file.awsS3BucketName', {
      infer: true,
    });
    this.region = this._configService.get('file.awsRegion', { infer: true });
    this.s3Client = new S3Client({
      region: this.region,
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
    // console.log(
    //   `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}.${ext}`,
    // );
    return result;
  }
}
