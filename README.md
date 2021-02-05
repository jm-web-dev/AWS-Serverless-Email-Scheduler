# AWS TypeScript API

This repo is designed to showcase how easy it can be to build and deploy an API on AWS using Serverless and TypeScript.

## Setup

To start you need to run `npm install` to install all of the required dependencies.

Once that is done you just need to edit a few config bits in the _serverless.ts_ file. In the _provider_ section you need to make sure that your `profile` and `region` are correctly configured. Your profile should be name of the credentials you want to deploy to your AWS account with. If you've never set up AWS credentials then you can check out [this video](https://www.youtube.com/watch?v=D5_FHbdsjRc).

## What's in this Repo

There are two main parts to this repo. the `serverless.ts` file and the `lambdas` folder.

The `serverless.ts` file is the file which defines the infrastructure that you want to deploy. When you add a new lambda you need to tell serverless what and how to deploy it.

The `lambdas` folder contains all of the lambda endpoints that you are wanting to deploy, one file for each lambda. As well as that there is a `common` folder where you can add files that contain code you want to use across multiple lambdas.
