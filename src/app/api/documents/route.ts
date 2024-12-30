import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, content } = await req.json()

  const document = await prisma.document.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  })

  return NextResponse.json(document)
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const documents = await prisma.document.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(documents)
}

