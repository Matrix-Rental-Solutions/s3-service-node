import { S3Operation, S3Options, S3SignedUrlConfig, S3UploadConfig, S3UrlConfig } from "./s3.extras";
import * as stream from "stream";
import { Readable } from "stream";
export declare class S3Service {
    private static _instance;
    private readonly SPECIAL_DIRECTORIES;
    private readonly NORMAL_DIRECTORIES;
    private readonly BUCKET_AUDIO_KEY;
    private readonly BUCKET_AUDIO_REGION;
    private readonly BUCKET_VIDEO_KEY;
    private readonly BUCKET_VIDEO_REGION;
    private readonly BUCKET_INTERNAL_EXISTS;
    private readonly BUCKET_INTERNAL_KEY;
    private readonly BUCKET_INTERNAL_REGION;
    private constructor();
    static init(options: S3Options): S3Service;
    getRootUrl(config?: S3UrlConfig): string;
    getAudioRootUrl(config?: S3UrlConfig): string;
    getVideoRootUrl(config?: S3UrlConfig): string;
    getRelativeUrl(namespace: string, directory?: string): string;
    getSignedUrl(operation: S3Operation, namespace: string, config: S3SignedUrlConfig): string;
    getAudioSignedUrl(operation: S3Operation, namespace: string, config: S3SignedUrlConfig): string;
    getVideoSignedUrl(operation: S3Operation, namespace: string, config: S3SignedUrlConfig): string;
    upload(data: Buffer | Uint8Array | string | Readable, namespace: string, config: S3UploadConfig): Promise<any>;
    uploadAudio(data: Buffer | Uint8Array | string | Readable, namespace: string, config: S3UploadConfig): Promise<any>;
    uploadVideo(data: Buffer | Uint8Array | string | Readable, namespace: string, config: S3UploadConfig): Promise<any>;
    download(filePath: string, namespace: string): Promise<any>;
    downloadAudio(filePath: string, namespace: string): Promise<any>;
    downloadVideo(filePath: string, namespace: string): Promise<any>;
    streamUpload(readStream: stream.Stream, namespace: string, config: S3UploadConfig): Promise<any>;
    streamUploadAudio(readStream: stream.Stream, namespace: string, config: S3UploadConfig): Promise<any>;
    streamUploadVideo(readStream: stream.Stream, namespace: string, config: S3UploadConfig): Promise<any>;
    getRandomNormalDirectory(): string;
    getRandomSpecialDirectory(subDirName?: string): string;
    checkIfSpecialDirectory(namespace: string): boolean;
    private _getRandomDirectory;
    private _getRootUrl;
    private _getSignedUrl;
    private _upload;
    private _download;
    private _streamUpload;
}
