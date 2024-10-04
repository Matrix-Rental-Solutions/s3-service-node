"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var s3_extras_1 = require("./s3.extras");
var AWS = require("aws-sdk");
var _ = require("lodash");
var stream = require("stream");
var fs = require("fs");
var S3Service = /** @class */ (function () {
    function S3Service(options) {
        this.SPECIAL_DIRECTORIES = "GKS";
        this.NORMAL_DIRECTORIES = "ABCDEFHIJLMNOPQRTUVWXYZ" + "ABCABCXYZXYZXYZXYZ"; // Increasing Entropy
        AWS.config.update({
            accessKeyId: options.credentials.key,
            secretAccessKey: options.credentials.secret,
        });
        this.BUCKET_AUDIO_KEY = options.buckets.audio.key;
        this.BUCKET_AUDIO_REGION = options.buckets.audio.region;
        this.BUCKET_VIDEO_KEY = options.buckets.video.key;
        this.BUCKET_VIDEO_REGION = options.buckets.video.region;
        this.BUCKET_VIDEO_KEY = options.buckets.video.key;
        this.BUCKET_VIDEO_REGION = options.buckets.video.region;
        if (options.internalBucket) {
            this.BUCKET_INTERNAL_EXISTS = true;
            this.BUCKET_INTERNAL_KEY = options.internalBucket.key;
            this.BUCKET_INTERNAL_REGION = options.internalBucket.region;
        }
        else {
            this.BUCKET_INTERNAL_EXISTS = false;
        }
    }
    S3Service.init = function (options) {
        console.info("[S3Service] init");
        if (this._instance) {
            // Cannot have multiple instance of this service
            // User IAM Role(s) to authenticate multiple buckets...
            throw s3_extras_1.S3Error.ALREADY_INITIALIZED;
        }
        this._instance = new S3Service(options);
        return this._instance;
    };
    S3Service.prototype.getRootUrl = function (config) {
        if (!this.BUCKET_INTERNAL_EXISTS) {
            // Cannot have multiple instance of this service
            // User IAM Role(s) to authenticate multiple buckets...
            throw s3_extras_1.S3Error.INTERNAL_BUCKET_NOT_INITIALIZED;
        }
        return this._getRootUrl(this.BUCKET_INTERNAL_KEY, this.BUCKET_INTERNAL_REGION, config);
    };
    S3Service.prototype.getAudioRootUrl = function (config) {
        return this._getRootUrl(this.BUCKET_AUDIO_KEY, this.BUCKET_AUDIO_REGION, config);
    };
    S3Service.prototype.getVideoRootUrl = function (config) {
        return this._getRootUrl(this.BUCKET_VIDEO_KEY, this.BUCKET_VIDEO_REGION, config);
    };
    S3Service.prototype.getRelativeUrl = function (namespace, directory) {
        var relativeUrl = namespace;
        if (directory) {
            relativeUrl = directory + "/" + relativeUrl;
        }
        return relativeUrl;
    };
    // const url = s3Service.getSignedUrl(S3Operation.GET_OBJECT, "test3.jpg", {
    //     directory: "testing",
    // });
    // const url = s3Service.getSignedUrl(S3Operation.PUT_OBJECT, "test3.jpg", {
    //     directory: "testing",
    //     acl: S3ACL.BUCKET_OWNER,
    //     contentType: "image/*"
    // });
    S3Service.prototype.getSignedUrl = function (operation, namespace, config) {
        if (!this.BUCKET_INTERNAL_EXISTS) {
            // Cannot have multiple instance of this service
            // User IAM Role(s) to authenticate multiple buckets...
            throw s3_extras_1.S3Error.INTERNAL_BUCKET_NOT_INITIALIZED;
        }
        return this._getSignedUrl(operation, namespace, this.BUCKET_INTERNAL_KEY, this.BUCKET_INTERNAL_REGION, config);
    };
    S3Service.prototype.getAudioSignedUrl = function (operation, namespace, config) {
        return this._getSignedUrl(operation, namespace, this.BUCKET_AUDIO_KEY, this.BUCKET_AUDIO_REGION, config);
    };
    S3Service.prototype.getVideoSignedUrl = function (operation, namespace, config) {
        return this._getSignedUrl(operation, namespace, this.BUCKET_VIDEO_KEY, this.BUCKET_VIDEO_REGION, config);
    };
    S3Service.prototype.upload = function (data, namespace, config) {
        return this._upload(data, namespace, this.BUCKET_INTERNAL_KEY, this.BUCKET_INTERNAL_REGION, config);
    };
    S3Service.prototype.uploadAudio = function (data, namespace, config) {
        return this._upload(data, namespace, this.BUCKET_AUDIO_KEY, this.BUCKET_AUDIO_REGION, config);
    };
    S3Service.prototype.uploadVideo = function (data, namespace, config) {
        return this._upload(data, namespace, this.BUCKET_VIDEO_KEY, this.BUCKET_VIDEO_REGION, config);
    };
    S3Service.prototype.download = function (filePath, namespace) {
        return this._download(filePath, namespace, this.BUCKET_INTERNAL_KEY, this.BUCKET_INTERNAL_REGION);
    };
    S3Service.prototype.downloadAudio = function (filePath, namespace) {
        return this._download(filePath, namespace, this.BUCKET_AUDIO_KEY, this.BUCKET_AUDIO_REGION);
    };
    S3Service.prototype.downloadVideo = function (filePath, namespace) {
        return this._download(filePath, namespace, this.BUCKET_VIDEO_KEY, this.BUCKET_VIDEO_REGION);
    };
    S3Service.prototype.streamUpload = function (readStream, namespace, config) {
        return this._streamUpload(readStream, namespace, this.BUCKET_INTERNAL_KEY, this.BUCKET_INTERNAL_REGION, config);
    };
    S3Service.prototype.streamUploadAudio = function (readStream, namespace, config) {
        return this._streamUpload(readStream, namespace, this.BUCKET_AUDIO_KEY, this.BUCKET_AUDIO_REGION, config);
    };
    S3Service.prototype.streamUploadVideo = function (readStream, namespace, config) {
        return this._streamUpload(readStream, namespace, this.BUCKET_VIDEO_KEY, this.BUCKET_VIDEO_REGION, config);
    };
    S3Service.prototype.getRandomNormalDirectory = function () {
        var firstDir = this._getRandomDirectory(this.NORMAL_DIRECTORIES);
        var subDir = this._getRandomDirectory(this.SPECIAL_DIRECTORIES + this.NORMAL_DIRECTORIES);
        return firstDir + "/" + subDir;
    };
    S3Service.prototype.getRandomSpecialDirectory = function (subDirName) {
        var firstDir = this._getRandomDirectory(this.SPECIAL_DIRECTORIES);
        if (subDirName) {
            return firstDir + "/" + subDirName;
        }
        return firstDir + "/" + this._getRandomDirectory(this.SPECIAL_DIRECTORIES + this.NORMAL_DIRECTORIES);
    };
    S3Service.prototype.checkIfSpecialDirectory = function (namespace) {
        var firstDir = namespace.split("/")[0]; // Ensuring that we only pick the root dir here...
        var specialCharacters = Array.from(this.SPECIAL_DIRECTORIES);
        return specialCharacters.indexOf(firstDir) !== -1;
    };
    S3Service.prototype._getRandomDirectory = function (dictionary) {
        return dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    };
    S3Service.prototype._getRootUrl = function (bucket, region, config) {
        var defaultConfig = {
            isAccelerated: false,
            keyPosition: s3_extras_1.S3UrlKeyPosition.PARAM
        };
        var _actualConfig = __assign({}, defaultConfig, config);
        if (_actualConfig.isAccelerated && _actualConfig.keyPosition === s3_extras_1.S3UrlKeyPosition.PARAM) {
            throw "ACCELERATION_TLD_ONLY";
        }
        var _tld = _actualConfig.keyPosition === s3_extras_1.S3UrlKeyPosition.TLD ? bucket + "." : "";
        var _param = _actualConfig.keyPosition === s3_extras_1.S3UrlKeyPosition.PARAM ? bucket + "/" : "";
        var _s3Domain = _actualConfig.isAccelerated ? "s3-accelerate" : "s3." + region;
        return "https://" + _tld + _s3Domain + ".amazonaws.com/" + _param;
    };
    S3Service.prototype._getSignedUrl = function (operation, namespace, bucket, region, config) {
        var configDefaults = {
            // directory: null,
            expiresIn: 60 * 5
        };
        var finalConfig = __assign({}, configDefaults, config);
        var relativeUrl = this.getRelativeUrl(namespace, finalConfig.directory);
        // TODO Optimization: Singleton maybe?
        var s3Ref = new AWS.S3({
            region: region,
            signatureVersion: "v4"
        });
        var s3Config = {
            Bucket: bucket,
            Key: relativeUrl,
            Expires: finalConfig.expiresIn
        };
        if (finalConfig.acl) {
            s3Config["ACL"] = finalConfig.acl;
        }
        if (finalConfig.contentType) {
            s3Config["ContentType"] = finalConfig.contentType;
        }
        if (finalConfig.customMeta) {
            // Compatible with S3
            s3Config["Metadata"] = _.mapKeys(finalConfig.customMeta, function (value, key) {
                return "x-amz-meta-" + key;
            });
        }
        return s3Ref.getSignedUrl(operation, s3Config);
    };
    S3Service.prototype._upload = function (data, namespace, bucket, region, config) {
        var s3 = new AWS.S3({
            region: region
        });
        var s3UploadConfig = {
            Bucket: bucket,
            Key: namespace,
            Body: data,
        };
        if (config.acl) {
            s3UploadConfig.ACL = config.acl;
        }
        if (config.contentType) {
            s3UploadConfig.ContentType = config.contentType;
        }
        if (config.customMeta) {
            // Compatible with S3
            s3UploadConfig.Metadata = _.mapKeys(config.customMeta, function (value, key) {
                return "x-amz-meta-" + key;
            });
        }
        return s3.putObject(s3UploadConfig).promise();
    };
    S3Service.prototype._download = function (filePath, namespace, bucket, region) {
        var s3 = new AWS.S3({
            region: region
        });
        var fileWriteStream = fs.createWriteStream(filePath);
        var s3ReadStream = s3.getObject({
            Bucket: bucket,
            Key: namespace
        }).createReadStream();
        return new Promise((function (resolve, reject) {
            s3ReadStream.pipe(fileWriteStream).on("close", function () {
                resolve();
            });
        }));
    };
    S3Service.prototype._streamUpload = function (readStream, namespace, bucket, region, config) {
        var uploadStream = function (key) {
            var s3 = new AWS.S3({
                region: region,
            });
            var pass = new stream.PassThrough();
            var s3StreamConfig = {
                Bucket: bucket,
                Key: key,
                Body: pass,
            };
            if (config.acl) {
                s3StreamConfig.ACL = config.acl;
            }
            if (config.contentType) {
                s3StreamConfig.ContentType = config.contentType;
            }
            if (config.customMeta) {
                // Compatible with S3
                s3StreamConfig.Metadata = _.mapKeys(config.customMeta, function (value, key) {
                    return "x-amz-meta-" + key;
                });
            }
            return {
                s3Stream: pass,
                s3Promise: s3.upload(s3StreamConfig).promise(),
            };
        };
        var _a = uploadStream(namespace), s3Stream = _a.s3Stream, s3Promise = _a.s3Promise;
        readStream.pipe(s3Stream);
        return s3Promise;
    };
    return S3Service;
}());
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map