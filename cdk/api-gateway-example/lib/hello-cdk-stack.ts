import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2  from 'aws-cdk-lib/aws-ec2';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const labRole = iam.Role.fromRoleArn(this, 'Role', "arn:aws:iam::400060407322:role/LabRole", {mutable: false});

    const lambda = new cdk.aws_lambda.Function(this, 'HelloHandler', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      handler: 'hello.handler',
      code: cdk.aws_lambda.Code.fromAsset('lambda'),
      role: labRole, // important for the lab so the cdk will not create a new role
    });

    const anotherLambda = new cdk.aws_lambda.Function(this, 'AnotherHandler', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      handler: 'another.handler',
      code: cdk.aws_lambda.Code.fromAsset('another-lambda'),
      role: labRole, // important for the lab so the cdk will not create a new role
    });

    // add lambdas to the api gateway
    const api = new cdk.aws_apigateway.RestApi(this, 'HelloApi', {
      restApiName: 'HelloApi',
      description: 'This is a simple api',
      defaultCorsPreflightOptions: {
        allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS
      }
    });


    // curl https://jzsckrka64.execute-api.us-east-1.amazonaws.com/prod/hello
    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(lambda));

    //  curl -H "x-api-key: NibtbdRooO9YQCU16OuS69qPGKPckcrY7B94UM9K" https://jzsckrka64.execute-api.us-east-1.amazonaws.com/prod/another
    const another = api.root.addResource('another');
    another.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(anotherLambda), {
      apiKeyRequired: true 
    });

    // add usage plan to api gateway
    const plan = api.addUsagePlan('UsagePlan', {
      quota: {
        limit: 10000,
        period: cdk.aws_apigateway.Period.DAY
      }
    });

    // add api key to usage plan
    const apiKey = new cdk.aws_apigateway.ApiKey(this
      , 'ApiKey');
    plan.addApiKey(apiKey);

    plan.addApiStage({
      stage: api.deploymentStage
    });

    // add s3 bucket proxy to the api gateway
    const bucket = new s3.Bucket(this, 'HelloBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
    });

    // Output s3 bucket name
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });

    const s3Integration = this.createS3Integration(bucket, labRole);
    
    // curl https://kbjilkhg8l.execute-api.us-east-1.amazonaws.com/prod/assets/test/sample_image.jpg
    this.addAssetsEndpoint(api, s3Integration);
  }

  private createS3Integration(assetsBucket: cdk.aws_s3.IBucket, executeRole: cdk.aws_iam.IRole) {
    return new cdk.aws_apigateway.AwsIntegration({
      service: "s3",
      integrationHttpMethod: "GET",
      path: `${assetsBucket.bucketName}/{folder}/{key}`,
      options: {
        credentialsRole: executeRole,
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Content-Type": "integration.response.header.Content-Type",
            },
          },
        ],

        requestParameters: {
          "integration.request.path.folder": "method.request.path.folder",
          "integration.request.path.key": "method.request.path.key",
        },
      },
    });
  }

  private addAssetsEndpoint(
    apiGateway: cdk.aws_apigateway.RestApi,
    s3Integration: cdk.aws_apigateway.AwsIntegration
  ) {
    apiGateway.root
      .addResource("assets")
      .addResource("{folder}")
      .addResource("{key}")
      .addMethod("GET", s3Integration, {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Content-Type": true,
            },
          },
        ],
        requestParameters: {
          "method.request.path.folder": true,
          "method.request.path.key": true,
          "method.request.header.Content-Type": true,
        },
        apiKeyRequired: false,
      });
  }
}
