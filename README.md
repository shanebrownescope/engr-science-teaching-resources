# E-SCoPe

A centralized educational platform tailored to professors seeking to access and share resources that facilitate active learning and engagement. 

## Tech Stack
* <a href="https://nextjs.org" > Next.js </a>
* <a href="https://www.typescriptlang.org" > TypeScript </a>
* <a href="https://next-auth.js.org" > Next.auth </a>
* <a href="https://mantine.dev" > Mantine </a>
* <a href="https://www.mysql.com" > MySQL </a>
* <a href="https://aws.amazon.com/rds/" > AWS RDS </a>
* <a href="https://aws.amazon.com/s3/" > AWS S3 </a>
* <a href="https://www.nodemailer.com" > Nodemailer </a>

## Run Project Locally
To install the project, follow these steps:

1. Clone the repository
```bash
 git clone git@github.com:shanebrownescope/engr-science-teaching-resources.git 
```
 
2. Create `.env.local ` file in the root directory of the project and add the following environment variables:

```bash
# AWS RDS MySQL setup
HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

# AWS S3 setup
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

# Next.auth setup
AUTH_SECRET=

# Nodemailer setup
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=

# Other
SITE_URL=
TEAM_NAME=
```

You have to get your own AWS RDS, AWS S3, and Nodemailer information.

To generate `AUTH_SECRET` run:
```bash
npx auth secret
```

Or run `openssl rand -base64 33` and add it to `.env.local`


3. Install dependencies
```bash
npm install
```

4. Run the development server
```
npm run dev
```

5. Open <a href="http://localhost:3000"> http://localhost:3000 <> with your browser to see the result


<a href="https://next-auth.js.org/configuration/nextjs"> Next.auth configuration for Next.js</a>

## Deployment Procedures
This project is deployed using <a href="https://www.vercel.com" > Vercel </a> and is currently being maintained on our sponsor's Vercel account where deployments and build/runtime logs of the website can be monitored. 

Please contact our project's sponsor, Shane Brown @ OSU, for access to this account if you are interested in helping to maintain this project.

Updates to this project's main branch are automatically deployed, and can be viewed under *Deployments* in the side pane of this repository.

## Maintenance Guidelines
To keep the project up-to-date, we recommend performing regular maintenance tasks such as the following:

### Dependency Updates  
- Run `npm outdated` periodically to check for outdated packages.  
- Update dependencies with `npm update` and test thoroughly.  
- **Stack Updates**:  
  - Monitor [Next.js release notes](https://nextjs.org/blog) for breaking changes.  
  - Track [React.js updates](https://react.dev/blog) for deprecations or new features.  
  - Subscribe to newsletters (e.g., Mantine, NextAuth) for security patches.  

### Database Backups  
- Ensure automated backups are enabled in AWS RDS.  
- Verify backup retention policies.  

### AWS Resource Monitoring  
- Monitor AWS RDS (CPU, memory, storage) via services such as AWS CloudWatch.  
- Check S3 bucket storage usage and access logs.  

### Security Audits  
- Rotate AWS keys and `AUTH_SECRET` every 3–6 months.  
- Review NextAuth.js and Nodemailer configurations for vulnerabilities.  

### Performance Optimization  
- Clear unused files from S3 buckets.  
- Optimize database queries (e.g., add indexes for frequent searches).  

### Technology Upgrade Plan  
1. **Next.js/React.js**:  
   - Test upgrades in a staging environment before deploying.  
   - Use `npm install next@latest react@latest` to target latest stable versions.  
2. **TypeScript**:  
   - Review [TS release notes](https://devblogs.microsoft.com/typescript/) for type-checking improvements.  
3. **Breaking Changes**:  
   - Check `npm audit` for vulnerabilities after upgrades.  
   - Refer to [Next.js migration guides](https://nextjs.org/docs/app/getting-started) for version-specific steps.  

## Troubleshooting
Common errors we've encountered: 

### Database Connection Failures

**Symptoms**:
- "DB timeout" or "ECONNREFUSED" errors  
- "Too many connections" errors  

**Solutions**:
1. **Basic Checks**:
   - Verify `.env.local` RDS credentials (ensure no typos).  
   - Confirm AWS RDS instance is running (check AWS Console).  
   - Ensure security group allows inbound traffic on port `3306`.  

2. **Connection Pool Issues**:
   - If seeing "Too many connections":
     - Close all locally running instances of the project and wait a few minutes before relaunching.

### Vercel Deployment Failures

**Symptoms**:
- Build Errors during deployment.

**Solutions**:
1. **Basic Checks**:
   - Review Vercel’s build logs for any conflicts and make changes accordingly.

## Joining the community
Before users can login and use the site, they first have to sign up and get authenticated by our team.

Once approved or rejected, the user will get an email informing them and the user will be able to login and use the site if approved.

## Contributing Information
Users that want to contribute to site will need to submit a form with the necessary details of the resources they want to add. 

Our team will check and verify the information and will add once approved.

**NOTE** 

This feature will be implemented soon.
Users that want to contribute now can send an email to our team in the meantime.

## Future Developers
The [CONTRIBUTING.md](./CONTRIBUTING.md) file contains technical information about the project.  

I think cows are pretty cool