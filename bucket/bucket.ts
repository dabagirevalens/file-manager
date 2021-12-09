import { GetObjectOutput } from "@aws-sdk/client-s3";
import { getS3Bucket } from "./s3Bucket";
import { Duration } from 'luxon'


export const SIGNED_URL_EXIPRES = Duration.fromObject({minutes : 10})

export type FakeAwsFile = Required<Pick<GetObjectOutput, 'ContentType'>> &
    Pick<GetObjectOutput, 'ContentLength' | 'LastModified'> & { Body: Buffer }



export interface FileBucket {
    getSignedUrl(operation: 'get' | 'put', key: string, bucketId?: string): Promise<string>
    saveFile(key: string, file: FakeAwsFile, bucketId?: string): Promise<string>
    deleteObject(key: string, bucketId?: string): Promise<unknown>
}

const bucketId = process.env.AWS_BUCKET_NAME;

export function getBucket(): FileBucket {
    if (process.env.NODE_ENV === 'development') {
        return {} as FileBucket
    } else if (bucketId) {
        return getS3Bucket(bucketId)
    } else {
        throw new Error('Bucket not found')
    }
}