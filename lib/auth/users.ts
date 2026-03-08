import fs from "fs";
import path from "path";

export interface User {
  id: string;
  username: string;
  password: string;
}

const usersPath = path.join(process.cwd(), "data/users.json");

export function readUsers(): User[] {
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, "[]");
  }
  const data = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(data);
}

export function writeUsers(users: User[]): void {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}