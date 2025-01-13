import { createPayload, User } from "../types/userTypes";
import db from "../Utils/dbConnection";

export const getUserByEmailOrPhone = async (
  email: string,
  phone_number: string
) => {
  return await (
    await db.pool
  ).query(`SELECT id FROM users WHERE email = ? OR phone_number = ?`, [
    email,
    phone_number,
  ]);
};

export const getUserById = async (id: number): Promise<User[]> => {
  return await (
    await db.pool
  ).query(
    `SELECT CONCAT(first_name, ' ', last_name) AS name, email, phone_number FROM users WHERE id = ?`,
    [id]
  );
};

export const getUsersByIds = async (id: number[]) => {
  return await (
    await db.pool
  ).query(
    `SELECT id, CONCAT(first_name, ' ', last_name) AS name, email, phone_number, active FROM users WHERE id IN (?)`,
    [id]
  );
};

export const getUserByEmailAndPassword = async (
  email: string,
  password: string
) => {
  return await (
    await db.pool
  ).query(`SELECT id FROM users WHERE email = ? AND password = sha1(?)`, [
    email,
    password,
  ]);
};

export const createUser = async (user: createPayload) => {
  return await (
    await db.pool
  ).query(
    `INSERT INTO users (first_name, last_name, email, password, phone_number, active) VALUES (?, ?, ?, sha1(?), ?, ?, ?) `,
    [
      user.first_name,
      user.last_name,
      user.email,
      user.password,
      user.phone_number,
      user.active,
    ]
  );
};

export const updateUser = async (id, user) => {
  const updateCondition = user
    .keys()
    .map((key) => (key === "password" ? `${key} = sha1(?)` : `${key} = ?`))
    .join(", ");

  const values = user.values();

  return await (
    await db.pool
  ).query(`UPDATE users SET ${updateCondition} WHERE id = ?`, [...values, id]);
};
