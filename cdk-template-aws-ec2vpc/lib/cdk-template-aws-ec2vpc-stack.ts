import { CfnOutput, aws_ec2, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkTemplateAwsEc2VpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new aws_ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [{

        cidrMask: 24,
        name: 'ingress',
        subnetType: aws_ec2.SubnetType.PUBLIC,
      },
      {
        cidrMask: 24,
        name: 'application',
        subnetType: aws_ec2.SubnetType.PRIVATE_WITH_NAT,
      },
      {
        cidrMask: 28,
        name: 'rds',
        subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
      }
      ]
    });

    new CfnOutput(this, 'Region', {value: this.region})
    // example resource
    // const queue = new sqs.Queue(this, 'CdkTemplateAwsEc2VpcQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
