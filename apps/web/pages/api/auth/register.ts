import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { prisma } from "@restaurant-system/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, name } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: "이메일, 비밀번호, 이름은 필수입니다." 
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "올바른 이메일 형식이 아닙니다." 
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "비밀번호는 6자 이상이어야 합니다." 
      });
    }

    // 이메일 중복 검사
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "이미 가입된 이메일입니다." 
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 비밀번호 제외하고 응답
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("회원가입 에러:", error);
    return res.status(500).json({ 
      message: "회원가입 중 오류가 발생했습니다." 
    });
  }
} 