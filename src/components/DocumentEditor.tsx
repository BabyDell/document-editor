'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Comments from './Comments'

interface DocumentEditorProps {
  documentId: string
  initialContent: any
  initialTitle: string
}

export default function DocumentEditor({ documentId, initialContent, initialTitle }: DocumentEditorProps) {
  const { data: session } = useSession()
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)

  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider('ws://localhost:1234', documentId, ydoc)
  const type = ydoc.getXmlFragment('document')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: session?.user ? {
          name: session.user.name || 'Anonymous',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        } : undefined,
      }),
    ],
    content: initialContent,
  })

  useEffect(() => {
    const saveInterval = setInterval(saveDocument, 5000) // Save every 5 seconds
    return () => clearInterval(saveInterval)
  }, [])

  const saveDocument = async () => {
    if (!editor || isSaving) return

    setIsSaving(true)
    const content = editor.getJSON()

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) throw new Error('Failed to save document')
    } catch (error) {
      console.error('Error saving document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editor) return null

  return (
    <div className="p-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 text-2xl font-bold"
        placeholder="Document Title"
      />
      <EditorContent editor={editor} className="prose max-w-none" />
      <div className="mt-4">
        <Button onClick={saveDocument} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <Comments documentId={documentId} />
    </div>
  )
}

