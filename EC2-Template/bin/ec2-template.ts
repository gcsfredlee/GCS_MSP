#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Ec2TemplateStack } from '../lib/ec2-template-stack';

const app = new cdk.App();
new Ec2TemplateStack(app, 'Ec2TemplateStack');
