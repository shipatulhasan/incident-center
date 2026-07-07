import { useAppMutation } from '@/api/useAppMutation'
import { useAppQuery } from '@/api/useAppQuery'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import AppLoader from '@/components/ui/app-loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import IncidentForm from '../dashborad/components/IncidentForm'
import MentionCommentBox from './MentionBox'

const IncidentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useAuth()

  const queryClient = useQueryClient()

  /**
   * Local states
   */

  const [editing, setEditing] = useState(false)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const [post, setPost] = useState({
    rootCause: '',
    resolution: '',
    actionItemsText: ''
  })

  /**
   * Queries
   */

  const { data: incidentData, isPending } = useAppQuery<
    TApiResponse<TIncident>
  >({
    queryKey: ['incident', id],
    url: `/incidents/${id}`
  })

  const { data: usersData } = useAppQuery<
    TApiResponse<{
      users: TIUser[]
    }>
  >({
    queryKey: ['users'],
    url: '/auth/users'
  })

  const incident = incidentData?.data

  const users = usersData?.data.users ?? []

  /**
   * Sync postmortem
   */

  useEffect(() => {
    if (!incident) return

    setPost({
      rootCause: incident.rootCause || '',

      resolution: incident.resolution || '',

      actionItemsText: incident.actionItems?.map((i) => i.text).join('\n') || ''
    })
  }, [incident?._id])

  /**
   * Mutations
   */

  const updateIncident = useAppMutation<
    TApiResponse<{
      incident: TIncident
    }>
  >({
    method: 'patch'
  })

  const commentMutation = useAppMutation({
    method: 'post'
  })

  const deleteMutation = useAppMutation({
    method: 'delete'
  })

  /**
   * Actions
   */

  async function updateField(field: string, value: any) {
    await updateIncident.mutateAsync({
      url: `/incidents/${id}`,
      data: {
        [field]: value
      }
    })

    queryClient.invalidateQueries({
      queryKey: ['incident', id]
    })

    queryClient.invalidateQueries({
      queryKey: ['incidents']
    })
  }

  async function deleteIncident() {
    await deleteMutation.mutateAsync({
      url: `/incidents/${id}`
    })

    queryClient.invalidateQueries({
      queryKey: ['incidents']
    })

    navigate('/')
  }

  async function savePostmortem() {
    const actionItems = post.actionItemsText
      .split('\n')
      .filter(Boolean)
      .map((text) => ({
        text,
        owner: incident?.assignedTo?.name || 'TBD'
      }))

    await updateIncident.mutateAsync({
      url: `/incidents/${id}`,

      data: {
        rootCause: post.rootCause,

        resolution: post.resolution,

        actionItems
      }
    })

    queryClient.invalidateQueries({
      queryKey: ['incident', id]
    })
  }

  if (isPending) return <AppLoader />

  if (!incident) return null
  return (
    <section className='space-y-8'>
      {/* Back */}
      <Button variant='ghost' onClick={() => navigate('/')} className='gap-2'>
        ← Dashboard
      </Button>

      {/* Hero */}

      <Card className='glass-panel glass-panel-strong overflow-hidden ring-0'>
        <CardContent className='p-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
            <div className='space-y-4'>
              <Badge
                variant='outline'
                className='capitalize border-primary/30 bg-primary/10 text-primary'>
                {incident.severity}
              </Badge>

              <div>
                <h1
                  className='
                bg-linear-to-r
                from-primary
                via-brand
                to-pink-600
                bg-clip-text
                text-4xl
                font-black
                text-transparent
              '>
                  {incident.title}
                </h1>

                <p className='mt-3 max-w-3xl text-muted-foreground'>
                  {incident.description}
                </p>
              </div>
            </div>

            <div className='flex gap-3'>
              <Button onClick={() => setEditing(true)} className={'cursor-pointer bg-accent text-white hover:bg-accent/90'}>Edit Incident</Button>
              {editing && (
                <IncidentForm
                  open={editing}
                  onClose={() => setEditing(false)}
                  users={users}
                  initial={incident}
                />
              )}

              {user?.role === 'admin' && (
                <Button
                  // variant='destructive'
                  className={'border border-brand/50 bg-brand/10 text-accent cursor-pointer hover:bg-accent/60'}
                  
                  onClick={() => setDeleteConfirmOpen(true)}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Controls */}

        <Card className='glass-panel ring-0' >
          <CardContent className='space-y-6 p-6'>
            <h2 className='text-xl font-bold'>Incident Controls</h2>

            <div className='space-y-2'>
              <Label>Status</Label>

              <Select
                value={incident.status}
                onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='open'>Open</SelectItem>

                  <SelectItem value='investigating'>Investigating</SelectItem>

                  <SelectItem value='resolved'>Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Assigned Engineer</Label>

              <Select
                value={incident.assignedTo?.name || ''}
                onValueChange={(v) => updateField('assignedTo', v)}>
                <SelectTrigger>
                  <SelectValue placeholder='Unassigned' />
                </SelectTrigger>

                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-xl border bg-background/40 p-4'>
                <p className='text-sm text-muted-foreground'>Service</p>

                <strong>{incident.service}</strong>
              </div>

              <div className='rounded-xl border bg-background/40 p-4'>
                <p className='text-sm text-muted-foreground'>MTTR</p>

                <strong>{incident.mttrMinutes ?? '—'}m</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Postmortem */}

        <Card className='glass-panel ring-0' >
          <CardContent className='space-y-5 p-6'>
            <h2 className='text-xl font-bold'>Postmortem</h2>

            <Textarea
              placeholder='Root Cause'
              value={post.rootCause}
              onChange={(e) =>
                setPost({
                  ...post,
                  rootCause: e.target.value
                })
              }
            />

            <Textarea
              placeholder='Resolution'
              value={post.resolution}
              onChange={(e) =>
                setPost({
                  ...post,
                  resolution: e.target.value
                })
              }
            />

            <Textarea
              placeholder='Action items'
              value={post.actionItemsText}
              onChange={(e) =>
                setPost({
                  ...post,
                  actionItemsText: e.target.value
                })
              }
            />

            <div className='flex gap-3'>
              <Button onClick={savePostmortem} className={'cursor-pointer bg-accent text-white hover:bg-accent/90'} >Save Postmortem</Button>

              {/* <Button
                variant='outline'
                className='glass-control'
                onClick={exportPDF}>
                Export PDF
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='glass-panel ring-0'>
        <CardContent className='space-y-6 p-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>Timeline</h2>

            <Badge variant='outline'>
              {incident.timeline?.length ?? 0}
              events
            </Badge>
          </div>

          <MentionCommentBox
            users={users}
            onSubmit={async (message) => {
              try {
                await commentMutation.mutateAsync({
                  url: `/incidents/${id}/comments`,
                  data: {
                    message
                  }
                })

                queryClient.invalidateQueries({
                  queryKey: ['incident', id]
                })

                toast.success('Comment added', {
                  description:
                    'Timeline updated successfully. Mentioned users will be notified.'
                })
              } catch (error) {
                toast.error('Failed to add comment', {
                  description: 'Please try again later.'
                })
              }
            }}
          />

          <div className='space-y-4'>
            {[...(incident.timeline || [])].reverse().map((item) => (
              <div
                key={item._id}
                className='
                relative
                rounded-2xl
                border
                border-border/40
                bg-background/50
                p-5
                '>
                <div className='flex items-center justify-between'>
                  <Badge className='capitalize' variant='secondary'>
                    {item.type}
                  </Badge>

                  <span className='text-xs text-muted-foreground'>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className='mt-3'>{item.message}</p>

                <p className='mt-2 text-sm text-muted-foreground'>
                  {item.author?.name || 'System'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className={'bg-slate-500/10 ring-brand backdrop-blur-2xl'}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Incident?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className='bg-brand/10 ring-0 border-0'>
            <AlertDialogCancel  className={'cursor-pointer bg-accent text-white hover:bg-accent/90'}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={deleteIncident}
              className={'border border-brand/50 bg-brand/10 text-accent cursor-pointer hover:bg-accent/60'}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default IncidentDetails
// const DeleteDialog = ({}) => {
//   return (

//   )
// }
