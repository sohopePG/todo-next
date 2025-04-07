import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: [
      {completed: "asc"},
      {createdAt: "desc"}
    ],
  });
  return NextResponse.json(todos);
}

export async function POST(req) {
    const { title } = await req.json();
    const newTodo = await prisma.todo.create({
      data: { title },
    });
    return NextResponse.json(newTodo, { status: 201 });
}

export async function PATCH(req) {
    const { id, completed } = await req.json();
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    return NextResponse.json(updatedTodo);
  }

  export async function DELETE(req) {
    const { id } = await req.json();
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "Todo deleted" });
  }
  