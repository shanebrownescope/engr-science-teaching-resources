"use server"

import z from "zod"
import { RegisterFormEmailSchema } from '@/schemas';
import bcrypt from "bcryptjs"


import { transporter } from "@/utils/email";
import { getUserByEmail } from "@/database/data/user";
import dbConnect from "@/database/dbConnector";

// Function to send email to team with user information for approval
export const sendApprovalRequestToTeam = async (values: z.infer<typeof RegisterFormEmailSchema>) => {
  try {
    // Attempt to parse and validate the input data against the RegisterFormEmailSchema
    const validatedFields = RegisterFormEmailSchema.safeParse(values);

    // The data is not valid, return an error
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, firstName, lastName, username, password  } = validatedFields.data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email already exists in the database
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      console.error("-- Email already in use")
      return { failure: "Email already in use"}
    } 

    // Insert the user into the database
    const insertQuery = `
    INSERT INTO Users (Name, Email, Password, Role, FirstName, LastName) VALUES (?, ?, ?, ?, ?, ?)`
    const admin = "admin"
    const instructor = "instructor"
    const { results: insertedUser, error } = await dbConnect(insertQuery, [username, email, hashedPassword, instructor, firstName, lastName])
    
    console.log("insertedUser: ", insertedUser[0].insertId)

    if (error) {
      console.error('Error inserting user:', error);
      return { failure: "Failed to insert user", error: error};
    }

    const approvalRequestEmailContent = `
      <p>Dear Team,</p>
      <p>A new user has registered for the platform and is awaiting approval:</p>
      <p>Name: ${firstName} ${lastName}</p>
      <p>Email: ${email}</p>
      <p> Username: ${username}</p>
      <p>Please review and approve their account as necessary.</p>
      <p>Best regards,<br/>Your Team</p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: `Account Approval Request`,
      html: approvalRequestEmailContent,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: "Email sent", messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { failure: "Failed to send email", error: error};
  }
}

  
// Function to send email to user confirming registration and notifying about approval
export const sendUserRegistrationConfirmation = async ({ userEmail }: { userEmail: string }) => {
  try {
    // Validate the input data using Zod
    const validatedEmail = z.string().email().safeParse(userEmail);
    if (!validatedEmail.success) {
      return { failure: "Invalid email address", error: validatedEmail.error };
    }


    const userConfirmationEmailContent = `
      <p>Dear User,</p>
      <p>Thank you for your interest in joining our platform. Your account registration is received, and it is pending approval from the admin team. You will receive another email once your account is approved.</p>
      <p>Best regards,<br/>Your Team</p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: userEmail,
      subject: `Account Registration Confirmation`,
      html: userConfirmationEmailContent,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: "Registration email sent", messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { failure: "Failed to send email" ,error: error };
  }
}