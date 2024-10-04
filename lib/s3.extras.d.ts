import { Dictionary } from "async";
export interface S3Options {
    credentials: {
        key: string;
        secret: string;
    };
    buckets: {
        audio: {
            key: string;
            region: string;
        };
        video: {
            key: string;
            region: string;
        };
    };
    internalBucket?: {
        key: string;
        region: string;
    };
}
export declare enum S3ACL {
    PRIVATE = "private",
    PUBLIC_READ = "public-read",
    PUBLIC_READ_WRITE = "public-read-write",
    AUTHENTICATED_READ = "authenticated-read",
    AWS_EXEC_READ = "aws-exec-read",
    BUCKET_OWNER_READ = "bucket-owner-read",
    BUCKET_OWNER = "bucket-owner-full-control"
}
export declare enum S3Operation {
    GET_OBJECT = "getObject",
    PUT_OBJECT = "putObject"
}
export interface S3SignedUrlConfig {
    directory?: string;
    expiresIn?: number;
    acl?: S3ACL;
    contentType?: string;
    customMeta?: Dictionary<string>;
}
export interface S3UploadConfig {
    acl?: S3ACL;
    contentType?: string;
    customMeta?: Dictionary<string>;
}
export interface S3UrlConfig {
    isAccelerated: boolean;
    keyPosition: S3UrlKeyPosition;
}
export declare enum S3UrlKeyPosition {
    TLD = "tld",
    PARAM = "param"
}
export declare enum S3Error {
    ALREADY_INITIALIZED = "ERR_S3Service_LIBRARY_ALREADY_INITIALIZED",
    INTERNAL_BUCKET_NOT_INITIALIZED = "ERR_S3Service_INTERNAL_BUCKET_NOT_INITIALIZED"
}
