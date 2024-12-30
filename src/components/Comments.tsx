'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string
  }
}

interface CommentsProps {
  documentId: string
}

export default function Comments({ documentId }: CommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    const response = await fetch(`/api/documents/${documentId}/comments`)
    if (response.ok) {
      const data = await response.json()
      setComments(data)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return

    const response = await fetch(`/api/documents/${documentId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment }),
    })

    if (response.ok) {
      setNewComment('')
      fetchComments()
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              By {comment.author.name} on {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {session && (
        <div className="mt-4">
          <Input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2"
          />
          <Button onClick={addComment}>Add Comment</Button>
        </div>
      )}
    </div>
  )
}

