"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var S3ACL;
(function (S3ACL) {
    S3ACL["PRIVATE"] = "private";
    S3ACL["PUBLIC_READ"] = "public-read";
    S3ACL["PUBLIC_READ_WRITE"] = "public-read-write";
    S3ACL["AUTHENTICATED_READ"] = "authenticated-read";
    S3ACL["AWS_EXEC_READ"] = "aws-exec-read";
    S3ACL["BUCKET_OWNER_READ"] = "bucket-owner-read";
    S3ACL["BUCKET_OWNER"] = "bucket-owner-full-control";
})(S3ACL = exports.S3ACL || (exports.S3ACL = {}));
var S3Operation;
(function (S3Operation) {
    S3Operation["GET_OBJECT"] = "getObject";
    S3Operation["PUT_OBJECT"] = "putObject";
})(S3Operation = exports.S3Operation || (exports.S3Operation = {}));
var S3UrlKeyPosition;
(function (S3UrlKeyPosition) {
    S3UrlKeyPosition["TLD"] = "tld";
    S3UrlKeyPosition["PARAM"] = "param";
})(S3UrlKeyPosition = exports.S3UrlKeyPosition || (exports.S3UrlKeyPosition = {}));
var S3Error;
(function (S3Error) {
    S3Error["ALREADY_INITIALIZED"] = "ERR_S3Service_LIBRARY_ALREADY_INITIALIZED";
    S3Error["INTERNAL_BUCKET_NOT_INITIALIZED"] = "ERR_S3Service_INTERNAL_BUCKET_NOT_INITIALIZED";
})(S3Error = exports.S3Error || (exports.S3Error = {}));
//# sourceMappingURL=s3.extras.js.map