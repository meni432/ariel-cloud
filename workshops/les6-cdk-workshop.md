# CDK Workshop
## Objective
This workshop will guide you through the process of setting up AWS CDK on an EC2 instance,
downloading and preparing a GitHub repository, bootstrapping an AWS account, and extending
the existing example by adding a DynamoDB table. All tasks will be performed using VS Code
connected remotely to an EC2 instance with Amazon Linux 2023 and the appropriate IAM role.

## Prerequisites
  - An EC2 instance with Amazon Linux 2023.
  - VS Code installed on your local machine with the Remote - SSH extension.
  - LabRole IAM role attached to the EC2 instance.

## Step by step instruction for bootstrap CDK

### Install Github CLI
```bash
type -p yum-config-manager >/dev/null || sudo yum install yum-utils
sudo yum-config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
sudo yum install gh
```

```bash
sudo yum update gh
```

### Authenticate with Github CLI
```bash
gh auth login
```

follow the instruction to fully authhenticate.

### Clone the Repository 
```bash
gh repo clone meni432/hello-cdk-aws-lab
cd hello-cdk-aws-lab
```

### Remove Git Origin
```bash
git remote remove origin
```

### Connect Github repo to you account
Make sure that you update `<your-github-username>` and `<your-new-repo>`
```bash
git remote add origin https://github.com/<your-github-username>/<your-new-repo>.git
git push -u origin main
```

### Bootstrap your AWS Academy account
- Update the AWS account information inside `/main/bin/hello-cdk.ts#L60`
```bash
cdk bootstrap --template bootstrap-template.yaml
```
### Install CDK
```bash
npm install -g aws-cdk
```

### Execute CDK Deploy
```bash
cdk deploy
```

## Add Code for create DynamoDB Table
Modify CDK and add DynamoDB Table to you account.
Verifty that the table ezisting in the AWS Console UI.

## Conclusion
By following these steps, you should have successfully installed the GitHub CLI, cloned and
prepared the repository, bootstrapped the AWS Academy account, and extended the existing
AWS CDK example by adding a DynamoDB table to store students and assignments data.




