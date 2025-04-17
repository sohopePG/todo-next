import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { completed: "asc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("データ取得エラー", error);
    return NextResponse.json({ error: "データ取得エラー" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  try {
    const { title } = await req.json();
    const newTodo = await prisma.todo.create({
      data: { title },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error("データ登録エラー", error);
    return NextResponse.json({ error: "データ登録エラー" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(req) {
  try {
    const { id, completed } = await req.json();
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("データ更新エラー", error);
    return NextResponse.json({ error: "データ更新エラー" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("データ削除エラー", error);
    return NextResponse.json({ error: "データ削除エラー" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}