import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ACCEPT_JOIN_REQUEST, DENY_JOIN_REQUEST } from '@/graphql/queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export function JoinRequestsManager({ projectId, joinRequests, refetchJoinRequests }) {
  const [isOpen, setIsOpen] = useState(false)

  const [acceptJoinRequest] = useMutation(ACCEPT_JOIN_REQUEST, {
    onCompleted: () => {
      toast({
        title: "Request accepted",
        description: "The user has been added to the project.",
      })
      refetchJoinRequests()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to accept request: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  const [denyJoinRequest] = useMutation(DENY_JOIN_REQUEST, {
    onCompleted: () => {
      toast({
        title: "Request denied",
        description: "The join request has been denied.",
      })
      refetchJoinRequests()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to deny request: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  const handleAccept = async (requestId) => {
    await acceptJoinRequest({
      variables: { projectId, requestId }
    })
  }

  const handleDeny = async (requestId) => {
    await denyJoinRequest({
      variables: { projectId, requestId }
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Manage Join Requests ({joinRequests.length})
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Join Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {joinRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={request.user.profileImageUrl} alt={request.user.username} />
                    <AvatarFallback>{request.user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.user.username}</p>
                    <p className="text-sm text-gray-500">{request.message}</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button onClick={() => handleAccept(request.id)} variant="outline">Accept</Button>
                  <Button onClick={() => handleDeny(request.id)} variant="outline">Deny</Button>
                </div>
              </div>
            ))}
            {joinRequests.length === 0 && (
              <p className="text-center text-gray-500">No pending join requests.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
