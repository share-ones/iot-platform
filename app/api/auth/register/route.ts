import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("注册请求 body:", body);

    const { email, password } = body;

    if (!email || !password) {
      console.log("邮箱或密码为空");
      return Response.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    console.log("用户是否已存在:", exists);

    if (exists) return Response.json({ error: "用户已存在" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });

    console.log("创建成功:", user);

    return Response.json({ success: true, userId: user.id });
  } catch (err) {
    console.error("注册失败:", err);
    return Response.json({ error: "服务器繁忙，请稍后重试" }, { status: 500 });
  }
}