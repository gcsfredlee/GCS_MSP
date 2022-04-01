import { CfnOutput ,aws_iam ,aws_ec2 ,Duration, Stack, StackProps, aws_s3_assets } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
// import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as path from 'path';
// import { KeyPair } from 'cdk-ec2-key-pair';
// import { Asset } from 'aws-cdk-lib/aws-s3-assets';


export class Ec2TemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create new VPC with 2 Subnets

    const vpc = new aws_ec2.Vpc(this, 'VPC', {
        natGateways: 0,
        subnetConfiguration: [{
          cidrMask: 24,
          name: "asterisk",
          subnetType: aws_ec2.SubnetType.PUBLIC
        }]
    });
    //old version.
    // const vpc = new ec2.Vpc(this, 'VPC', {
    //   natGateways: 0,
    //   subnetConfiguration: [{
    //     cidrMask: 24,
    //     name: "asterisk",
    //     subnetType: ec2.SubnetType.PUBLIC
    //   }]
    // });

    // Allow SSH (TCP Port 22) access from anywhere
    
    const securityGroup = new aws_ec2.SecurityGroup(this, 'SecurityGroup',{
      vpc,
      description: 'Allow SSH (TCP port 22) in',
      allowAllOutbound: true
    });
    
    //old version
    // const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
    //   vpc,
    //   description: 'Allow SSH (TCP port 22) in',
    //   allowAllOutbound: true
    // });
    securityGroup.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(22), 'Allow SSH Access')

    const role = new aws_iam.Role(this, 'ec2Role', {
      assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com')
    })

    role.addManagedPolicy(aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'))

    // Use Latest Amazon Linux Image - CPU Type X86_64
    const ami = new aws_ec2.AmazonLinuxImage({
      generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: aws_ec2.AmazonLinuxCpuType.X86_64
    });

    // Create the instance using the Security Group, AMI, and KeyPair defined in the VPC created
    const ec2Instance = new aws_ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.micro),
      machineImage: ami,
      securityGroup: securityGroup,
      // keyName: key.keyPairName,
      role: role
    });

    // Create an asset that will be used as part of User Data to run on first load
    // const asset = new aws_s3_assets.Asset(this, 'Asset', { path: path.join(__dirname, '../src/config.sh') });
    // const localPath = ec2Instance.userData.addS3DownloadCommand({
    //   bucket: asset.bucket,
    //   bucketKey: asset.s3ObjectKey,
    // });
    // TEST123
    // ec2Instance.userData.addExecuteFileCommand({
    //   filePath: localPath,
    //   arguments: '--verbose -y'
    // });
    // asset.grantRead(ec2Instance.role);

    // Create outputs for connecting
    new CfnOutput(this, 'IP Address', { value: ec2Instance.instancePublicIp });
    // new cdk.CfnOutput(this, 'Key Name', { value: key.keyPairName })
    new CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
    new CfnOutput(this, 'ssh command', { value: 'ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@' + ec2Instance.instancePublicIp })
  }
}
