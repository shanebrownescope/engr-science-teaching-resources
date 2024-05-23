"use server";

import z from "zod";
import { RegisterFormEmailSchema } from "@/schemas";
import bcrypt from "bcryptjs";

import { transporter } from "@/utils/email";
import { getUserByEmail } from "@/database/data/user";
import dbConnect from "@/database/dbConnector";

/**
 * Function to send email to team with user information for approval
 *
 * @param values - An object containing the user's email, first name, last name, username, and password
 * @returns An object with the status of the operation (success, error, or failure) and the message ID if successful
 */
export const sendApprovalRequestToTeam = async (
  values: z.infer<typeof RegisterFormEmailSchema>,
) => {
  try {
    const validatedFields = RegisterFormEmailSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, firstName, lastName, username, password } =
      validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.error("-- Email already in use");
      return { failure: "Email already in use" };
    }

    const insertQuery = `
      INSERT INTO Users_v2 (name, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)`;

    const instructor = "instructor";
    const { results: insertedUser, error } = await dbConnect(insertQuery, [
      username,
      email,
      hashedPassword,
      instructor,
      firstName,
      lastName,
    ]);

    if (error) {
      console.error("Error inserting user:", error);
      return { failure: "Failed to insert user", error: error };
    }

    const approvalRequestEmailContent = `
      <p>Dear Team,</p>
      <p>A new user has registered for the platform and is awaiting approval:</p>
      <p>Name: ${firstName} ${lastName}</p>
      <p>Email: ${email}</p>
      <p> Username: ${username}</p>
      <p>Please review and approve their account as necessary.</p>
      <p>Best regards,<br/> ${process.env.TEAM_NAME} </p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: `Account Approval Request`,
      html: approvalRequestEmailContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: "Email sent", messageId: info.messageId };
  } catch (error) {
    return { failure: "Failed to send email", error: error };
  }
};

/**
 * Function to send email to user confirming registration and notifying about approval
 *
 * @param email - The email address of the user
 * @param firstName - The first name of the user
 * @param lastName - The last name of the user
 * @returns An object with the status of the operation (success, error, or failure) and the message ID if successful
 */
export const sendUserRegistrationConfirmation = async (
  email: string,
  firstName: string,
  lastName: string,
) => {
  try {
    // Validate the email
    const validatedEmail = z.string().email().safeParse(email);
    if (!validatedEmail.success) {
      return { failure: "Invalid email address", error: validatedEmail.error };
    }

    const userConfirmationEmailContent = `
      <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for your interest in joining our platform. Your account registration is received, and it is pending approval from the admin team. You will receive another email once your account is approved.</p>
      <p>Best regards,<br/> ${process.env.TEAM_NAME} </p>
    `;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `Account Registration Confirmation`,
      html: userConfirmationEmailContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: "Registration email sent", messageId: info.messageId };
  } catch (error) {
    return { failure: "Failed to send email", error: error };
  }
};
