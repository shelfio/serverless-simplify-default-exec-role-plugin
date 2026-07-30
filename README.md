# serverless-simplify-default-exec-role-plugin

> Fixes "IamRoleLambdaExecution - Maximum policy size of 10240 bytes exceeded" error

This plugin works by modifying the Cloudformation stack before deployment.

It searches for the `IamRoleLambdaExecution` resource and modifies the only policy attached to this role.

## Install

```
$ pnpm add -D @shelf/serverless-simplify-default-exec-role-plugin
```

## Usage

In your `serverless.yml` file:

```yaml
plugins:
  - '@shelf/serverless-simplify-default-exec-role-plugin'
```

## Explanation

By default, Serverless framework creates such role:

```json5
{
  Effect: 'Allow',
  Action: ['logs:CreateLogStream', 'logs:CreateLogGroup'],
  Resource: [
    {
      'Fn::Sub': 'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-createUser:*',
    },
    {
      'Fn::Sub': 'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-updateUser:*',
    },
    {
      'Fn::Sub': 'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-deleteUser:*',
    },
    // dozens of identical lines
  ],
}
```

When you reach a certain project size, deployment will fail since this role will exceed 10 KB limit.

This plugin simplifies the default execution role to smth like this:

```json5
{
  Effect: 'Allow',
  Action: ['logs:CreateLogStream', 'logs:CreateLogGroup'],
  Resource: [
    {
      'Fn::Sub': 'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:*',
    },
  ],
}
```

## How to release a new version

Bump the version on the same branch that contains the changes you want to publish:

```sh
pnpm version major|minor|patch|x.y.z
```

Use `major`, `minor`, `patch`, a prerelease increment, or an exact `x.y.z` version.

`pnpm version` creates the version commit automatically. Push the branch, open a
PR to `master`, and merge it. After the merge, centralized CircleCI publishes the
new version to npm using OIDC.

## License

MIT © [Shelf](https://shelf.io)
