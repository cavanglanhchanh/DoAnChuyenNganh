import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmailOrPhone, createUser } from "../repositories/user.repo.js";

export async function loginService(identifier, password) {
  const user = await findUserByEmailOrPhone(identifier);
  if (!user) throw new Error("Tài khoản không tồn tại");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Sai mật khẩu");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
}

/**
 * REGISTER SERVICE
 */
export async function registerService(data) {
  const { name, email, phone, password, role } = data;

  // check trùng email / phone
  const existed =
    (email && (await findUserByEmailOrPhone(email))) ||
    (phone && (await findUserByEmailOrPhone(phone)));

  if (existed) {
    throw new Error("Tài khoản đã tồn tại");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // tạo user
  await createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role
  });
}