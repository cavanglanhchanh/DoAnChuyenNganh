import { loginService, registerService } from "../services/auth.service.js";

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });

    const data = await loginService(identifier, password);
    res.json(data);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}


/**
 * REGISTER API
 */
export async function register(req, res) {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Thiếu thông tin đăng ký"
      });
    }

    await registerService({
      name,
      email,
      phone,
      password,
      role: role || "OWNER"
    });

    res.json({
      message: "Đăng ký thành công"
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
}

