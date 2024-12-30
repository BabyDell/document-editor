import { getServerSession } from "next-auth/next"
import { Session } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = (await getServerSession(authOptions)) as Session | null


  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Link href="/api/auth/signin">
          <Button>Sign in</Button>
        </Link>
      </div>
    )
  }

  const documents = await prisma.document.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Documents</h1>
      <ul className="space-y-2">
        {documents.map((doc : any) => (
          <li key={doc.id}>
            <Link href={`/documents/${doc.id}`}>
              <span className="text-blue-500 hover:underline">{doc.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/documents/new">
        <Button className="mt-4">Create New Document</Button>
      </Link>
    </div>
  )
}

