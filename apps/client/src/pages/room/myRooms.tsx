import React from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import useAxios from "@/hooks/use-axios"
import { useAppSelector } from "@/store/hooks"
import { Space } from "@/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"

const MyRooms = () => {
  const { toast } = useToast()

  const api = useAxios()
  const queryClient = useQueryClient()
  const { user } = useAppSelector((state) => state.auth)

  // Fetch Spaces
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myspaces"],
    queryFn: async () => {
      return (await api.get(`/room/user/${user?.id}`)).data
    }
  })

  // Delete Space Mutation
  const deleteMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      return await api.delete(`/room/${spaceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myspaces"] })
      toast({
        title: "Space Deleted",
        description: "The space has been successfully removed."
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the space.",
        variant: "destructive"
      })
    }
  })

  // Edit Space Mutation
  const editMutation = useMutation({
    mutationFn: async ({ spaceId, roomName }: { spaceId: string, roomName: string }) => {
      return await api.patch(`/room/${spaceId}`, { roomName })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myspaces"] })
      toast({
        title: "Space Updated",
        description: "The space details have been successfully updated."
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the space.",
        variant: "destructive"
      })
    }
  })

  // Toggle Active Status Mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      return await api.put(`/room/toggleActive/${spaceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myspaces"] })
      toast({
        title: "Space Status Updated",
        description: "The space active status has been changed."
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update space status.",
        variant: "destructive"
      })
    }
  })

  // Create Space Dialog Component
  const CreateSpaceDialog = () => {
    const [roomName, setRoomName] = React.useState('')

    const handleCreate = async () => {
      try {
        await api.post('/room', { 
          roomName, 
          creatorId: user?.id 
        })
        queryClient.invalidateQueries({ queryKey: ["myspaces"] })
        toast({
          title: "Space Created",
          description: "A new space has been successfully added."
        })
        setRoomName('')
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create a new space.",
          variant: "destructive"
        })
      }
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
         
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomName" className="text-right">
                Space Name
              </Label>
              <Input 
                id="roomName" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="col-span-3" 
              />
            </div>
          </div>
          <Button onClick={handleCreate}>Create Space</Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Edit Space Dialog Component
  const EditSpaceDialog = ({ space }: { space: Space }) => {
    const [roomName, setRoomName] = React.useState(space.roomName)

    const handleEdit = () => {
      editMutation.mutate({ 
        spaceId: space.id, 
        roomName 
      })
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="mr-2">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Space</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editRoomName" className="text-right">
                Space Name
              </Label>
              <Input 
                id="editRoomName" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="col-span-3" 
              />
            </div>
          </div>
          <Button onClick={handleEdit}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    )
  }

  if (isLoading) return <div>Loading spaces...</div>
  if (isError) return <div>Error loading spaces: {error.message}</div>

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Spaces</h1>
        <CreateSpaceDialog />
      </div>
      
      {data?.data && data.data.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't created any spaces yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data.map((space: Space) => (
            <div 
              key={space.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-grow">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold">{space.roomName}</h3>
                    <p className="text-sm text-muted-foreground">Space Code: {space.roomCode}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Active:</span>
                    <Switch
                      checked={space.isActive}
                      onCheckedChange={() => toggleActiveMutation.mutate(space.id)}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Created: {new Date(space.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <EditSpaceDialog space={space} />
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => deleteMutation.mutate(space.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default MyRooms