#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VpcWith3AzStack } from '../lib/vpc-with-3_az-stack';

const app = new cdk.App();
const env ={
  region:process.env.CDK_DEFAULT_REGION,
  account:process.env.CDK_DEFAULT_ACCOUNT
}
new VpcWith3AzStack(app, 'VpcWith3AzStack',{
    env
});
