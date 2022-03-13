#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkTemplateAwsSqsStack } from '../lib/cdk-template-aws-sqs-stack';

const app = new cdk.App();
new CdkTemplateAwsSqsStack(app, 'CdkTemplateAwsSqsStack');
