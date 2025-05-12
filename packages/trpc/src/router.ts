import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const employeeRouter = router({
  // 직원 목록 조회
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.employee.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // 직원 상세 조회
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return ctx.prisma.employee.findUnique({
        where: { id: input.id },
        include: { user: true },
      });
    }),

  // 직원 생성
  create: publicProcedure
    .input(z.object({
      email: z.string().email("올바른 이메일 형식이 아닙니다"),
      name: z.string().min(1, "이름은 필수입니다"),
      hireDate: z.string(), // ISO string
    }))
    .mutation(async ({ input, ctx }) => {
      // User 먼저 생성 (임시)
      const user = await ctx.prisma.user.create({
        data: { 
          email: input.email, 
          name: input.name,
          password: "", // TODO: 비밀번호 처리 필요
        }
      });

      return ctx.prisma.employee.create({
        data: {
          userId: user.id,
          position: "Staff",
          hireDate: new Date(input.hireDate)
        },
        include: { user: true }
      });
    }),

  // 직원 수정
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1, "이름은 필수입니다"),
      position: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.employee.update({
        where: { id: input.id },
        data: { 
          position: input.position,
          user: { 
            update: { 
              name: input.name 
            } 
          }
        },
        include: { user: true }
      });
    }),

  // 직원 삭제
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const employee = await ctx.prisma.employee.findUnique({
        where: { id: input.id },
        include: { user: true }
      });

      if (!employee) {
        throw new Error("직원을 찾을 수 없습니다.");
      }

      // Employee 삭제
      await ctx.prisma.employee.delete({ 
        where: { id: input.id } 
      });

      // User 삭제
      await ctx.prisma.user.delete({
        where: { id: employee.userId }
      });

      return { success: true };
    }),
});

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: `안녕하세요, ${input.name}님!` };
    }),

  employee: employeeRouter,
});

export type AppRouter = typeof appRouter;
