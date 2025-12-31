import Link from 'next/link'
import { Button, Card, CardContent } from '@ggprompts/ui'
import { UserX } from 'lucide-react'

export default function ProfileNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <UserX className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This user doesn&apos;t exist or has made their profile private.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
