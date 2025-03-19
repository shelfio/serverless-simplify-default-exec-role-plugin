'use strict';

class SimplifyDefaultExecRole {
  constructor(serverless) {
    this.hooks = {
      'before:package:finalize': function() {
        simplifyBaseIAMLogGroups(serverless);
      }
    };
  }
}

function simplifyBaseIAMLogGroups(serverless) {
  const resourceSection = serverless.service.provider.compiledCloudFormationTemplate.Resources;

  for (const key in resourceSection) {
    if (key === 'IamRoleLambdaExecution') {
      const newPolicyStatements = [];
      const previousStatements = resourceSection[key].Properties.Policies[0].PolicyDocument.Statement;
      for (const statement of previousStatements) {
        // skip '*' values
        if (!Array.isArray(statement.Resource)) {
          newPolicyStatements.push(statement);
          continue;
        }

        // replace only for log-group
        for (const [index, fn] of statement.Resource.entries()) {
          if (fn["Fn::Sub"]) {
            statement.Resource[index]["Fn::Sub"] = fn["Fn::Sub"].includes(
              "log-group"
            )
              ? "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:*"
              : fn["Fn::Sub"];
          }
        }
        newPolicyStatements.push(statement);
      }
      resourceSection[key].Properties.Policies[0].PolicyDocument.Statement = newPolicyStatements;
    }
  }
}

module.exports = SimplifyDefaultExecRole;
