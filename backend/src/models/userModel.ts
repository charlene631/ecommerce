import pool from "../config/database";
import { User } from "../types/user";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Type pour create et update
interface UserCreateData {
  firstname: string;
  lastname: string;
  email: string;
  hashedPassword: string;
  emailTokenExpiresAt: Date;
}

interface UserUpdateData extends UserCreateData {
  id: number;
}

// CREATE
export async function create(data: UserCreateData): Promise<ResultSetHeader> {
  const { firstname, lastname, email, hashedPassword, emailTokenExpiresAt } = data;
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO users (firstname, lastname, email, hashed_password, email_token_expires_at)
    VALUES (?, ?, ?, ?, ?)
    `,
    [firstname, lastname, email, hashedPassword, emailTokenExpiresAt]
  );
  return result;
}

// FIND BY EMAIL
export async function findByEmail(email: string): Promise<User | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT * FROM users WHERE email = ?
    `,
    [email]
  );
  return rows[0] as User | undefined;
}

// CONFIRM VERIFICATION
export async function confirmVerification(email: string): Promise<ResultSetHeader> {
  const [result] = await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET is_verified = TRUE
    WHERE email = ?
    `,
    [email]
  );
  return result;
}

// RECORD LAST LOGIN
export async function recordLastLogin(email: string): Promise<ResultSetHeader> {
  const date = new Date();
  const [result] = await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET last_login_at = ?
    WHERE email = ?
    `,
    [date, email]
  );
  return result;
}

// UPDATE USER
export async function update(data: UserUpdateData): Promise<ResultSetHeader> {
  const { id, firstname, lastname, email, hashedPassword, emailTokenExpiresAt } = data;
  const [result] = await pool.query<ResultSetHeader>(
    `
    UPDATE users
    SET firstname = ?, lastname = ?, email = ?, hashed_password = ?, email_token_expires_at = ?
    WHERE id = ?
    `,
    [firstname, lastname, email, hashedPassword, emailTokenExpiresAt, id]
  );
  return result;
}

// DELETE UNVERIFIED USERS
export async function deleteUnverifiedUsers(): Promise<ResultSetHeader> {
  const [result] = await pool.query<ResultSetHeader>(
    `
    DELETE FROM users
    WHERE is_verified = false AND email_token_expires_at < NOW()
    `
  );
  return result;
}
