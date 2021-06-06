import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws"

export const bucketName = pulumi.getStack()
const bucket = new aws.s3.Bucket(bucketName, { bucket: bucketName, website: { indexDocument: 'index.html' } })

new aws.s3.BucketPolicy(bucketName, {
  bucket: bucket.bucket,
  policy: bucket.bucket.apply((bucketName) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Principal: "*",
      Action: [
        "s3:GetObject"
      ],
      Resource: [
        `arn:aws:s3:::${bucketName}/*`
      ]
    }]
  }))
})

export const siteUrl = bucket.websiteEndpoint
