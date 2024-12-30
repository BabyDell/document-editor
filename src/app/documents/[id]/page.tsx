import { getServerSession } from "next-auth/next"
import { Session } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import DocumentEditor from "@/components/DocumentEditor"

export default async function DocumentPage({ params }: { params: { id: string } }) {
    const session = (await getServerSession(authOptions)) as Session | null

  if (!session || !session.user) {
    return <div>Please sign in to view this document.</div>
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: { author: true },
  })

  if (!document) {
    return <div>Document not found.</div>
  }

  if (document.authorId !== session.user.id) {
    return <div>You don't have permission to view this document.</div>
  }

  return (
    <div>
      <DocumentEditor
        documentId={document.id}
        initialContent={document.content}
        initialTitle={document.title}
      />
    </div>
  )
}

