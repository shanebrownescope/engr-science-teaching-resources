# E-SCoPe

E-SCoPE is a centralized educational platform tailored to professors seeking to access teaching materials. 

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