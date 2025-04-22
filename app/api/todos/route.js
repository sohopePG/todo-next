import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClientをシングルトンで管理
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// GET: 未完了タスクを優先し、作成日時の新しい順にTodo一覧を取得
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { completed: "asc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

// POST: 新しいTodoを作成
export async function POST(req) {
  try {
    const { title } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const newTodo = await prisma.todo.create({
      data: { title },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

// PATCH: Todoの完了状態を更新
export async function PATCH(req) {
  try {
    const { id, completed } = await req.json();
    if (!id || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

// DELETE: Todoを削除
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}