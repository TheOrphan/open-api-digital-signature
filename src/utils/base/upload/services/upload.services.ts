import { Injectable } from '@nestjs/common';
import * as config from 'config';
import * as AWS from 'aws-sdk';

const s3 = config.get('s3');

const S3Access = new AWS.S3({
  accessKeyId: s3.AWS_ACCESS_KEY_ID,
  secretAccessKey: s3.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class S3Service {
  public async uploadFile(
    file: any,
    pathname?: string,
    config?: any,
  ): Promise<void> {
    const urlKey = `${pathname || 'sharefolder/UNSIGNED/'}${file.originalname}`;

    const params = {
      Body: file.buffer,
      Bucket: s3.bucket,
      Key: urlKey,
      ...config,
    };

    const data = await S3Access.putObject(params)
      .promise()
      .then(
        data => {
          console.log(data);
          return urlKey;
        },
        err => {
          console.log(err);
          return err;
        },
      );

    return data;
  }
}
