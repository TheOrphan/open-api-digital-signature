import * as AWS from 'aws-sdk';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const s3 = config.get('s3');

const S3Access = new AWS.S3({
  accessKeyId: s3.AWS_ACCESS_KEY_ID,
  secretAccessKey: s3.AWS_SECRET_ACCESS_KEY,
});

export default async function uploadFileS3(
  file: any,
  pathname?: string,
  config?: any,
) {
  const { originalname } = file;
  const urlKey = `${pathname || 'sharefolder/UNSIGNED/'}${originalname}`;
  return await uploadS3(file, urlKey, config);
}

async function uploadS3(file, urlKey, config) {
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
        Logger.error(err);
        return err;
      },
    );
  return data;
}
