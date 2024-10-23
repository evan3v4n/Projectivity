import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { APPROVE_JOIN_REQUEST, DENY_JOIN_REQUEST } from '@/graphql/queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export function JoinRequestsManager({ projectId, joinRequests, refetchJoinRequests }) {
  const [pendingRequests, setPendingRequests] = useState(joinRequests)

  useEffect(() => {
    setPendingRequests(joinRequests.filter(request => request.status === 'PENDING'))
  }, [joinRequests])

  const [approveJoinRequest] = useMutation(APPROVE_JOIN_REQUEST, {
    onCompleted: (data) => {
      console.log("ACCEPTED")
      toast({
        title: "Request accepted",
        description: "The user has been added to the project.",
      })
      removeRequest(data.approveJoinRequest.id)
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

  const [rejectJoinRequest] = useMutation(DENY_JOIN_REQUEST, {
    onCompleted: (data) => {
      toast({
        title: "Request denied",
        description: "The join request has been denied.",
      })
      removeRequest(data.denyJoinRequest.id)
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

  const removeRequest = (requestId) => {
    setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId))
  }

  const handleAccept = async (requestId) => {
    console.log("Accepting request:", requestId);
    try {
      await approveJoinRequest({
        variables: { requestId }
      });
    } catch (error) {
      console.error("Error approving request:", error);
    }
  }

  const handleDeny = async (requestId) => {
    console.log("Denying request:", requestId);
    try {
      await rejectJoinRequest({
        variables: { requestId }
      });
    } catch (error) {
      console.error("Error denying request:", error);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Join Requests</h3>
      {pendingRequests.length === 0 ? (
        <p className="text-gray-500">No pending join requests.</p>
      ) : (
        pendingRequests.map((request) => (
          <div key={request.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${request.user.username}`} />
                <AvatarFallback>{request.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{request.user.username}</h4>
                <p className="text-sm text-gray-500">{request.user.email}</p>
              </div>
            </div>
            <p className="mt-2 text-sm">{request.user.bio || 'No bio provided'}</p>
            <div className="mt-2">
              <h5 className="text-sm font-semibold">Skills:</h5>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.user.skills && request.user.skills.length > 0 ? (
                  request.user.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No skills listed</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => handleAccept(request.id)} variant="outline">Accept</Button>
              <Button onClick={() => handleDeny(request.id)} variant="outline">Deny</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
