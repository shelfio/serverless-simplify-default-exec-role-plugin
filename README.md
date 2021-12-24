# serverless-simplify-default-exec-role-plugin [![CircleCI](https://circleci.com/gh/shelfio/serverless-simplify-default-exec-role-plugin/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/serverless-simplify-default-exec-role-plugin/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Fixes "IamRoleLambdaExecution - Maximum policy size of 10240 bytes exceeded" error

This plugin works by modifying the Cloudformation stack before deployment.

It searches for the `IamRoleLambdaExecution` resource and modifies the only policy attached to this role.

## Install

```
$ yarn add --dev @shelf/serverless-simplify-default-exec-role-plugin
```

## Usage

In your `serverless.yml` file:

```yaml
plugins:
  - serverless-simplify-default-exec-role-plugin
```

## Explanation

By default, Serverless framework creates such role:

```json5
{
  Effect: "Allow",
  Action: ["logs:CreateLogStream", "logs:CreateLogGroup"],
  Resource: [
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-createUser:*",
    },
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-updateUser:*",
    },
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-deleteUser:*",
    },
    // dozens of identical lines
  ],
}
```

When you reach a certain project size, deployment will fail since this role will exceed 10 KB limit.

This plugin simplifies the default execution role to smth like this:

```json5
{
  Effect: "Allow",
  Action: ["logs:CreateLogStream", "logs:CreateLogGroup"],
  Resource: [
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:*",
    },
  ],
}
```

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
