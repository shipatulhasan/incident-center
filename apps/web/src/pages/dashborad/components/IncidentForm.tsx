import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'

import { Textarea } from '@/components/ui/textarea'
import { useAppMutation } from '@/api/useAppMutation'
import AppInput from '@/components/shared/AppInput'

const schema = z.object({
  title: z.string().min(1, 'Title required'),

  service: z.string().min(1, 'Service required'),

  description: z.string().min(1, 'Description required'),

  impact: z.string().optional(),

  severity: z.enum(['low', 'medium', 'high', 'critical']),

  assignedTo: z.string().optional()
})

type IncidentFormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  onClose: () => void

  users: TIUser[]

  initial?: any
}

export default function IncidentForm({ open, onClose, users, initial }: Props) {
  const queryClient = useQueryClient()

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: initial?.title ?? '',

      service: initial?.service ?? '',

      description: initial?.description ?? '',

      impact: initial?.impact ?? '',

      severity: initial?.severity ?? 'low',

      assignedTo: initial?.assignedTo?._id ?? ''
    }
  })

  const saveIncident = useAppMutation<
    TApiResponse<TIncident>,
    IncidentFormValues
  >({
    method: initial?._id ? 'patch' : 'post'
  })

  async function onSubmit(values: IncidentFormValues) {
    try {
      const result = await saveIncident.mutateAsync({
        url: initial?._id ? `/incidents/${initial._id}` : '/incidents',

        data: values
      })

      toast.success(initial ? 'Incident updated' : 'Incident created', {
        description: 'Reliability board updated successfully'
      })

      if (initial?._id) {
        // update existing
        queryClient.setQueryData(
          ['incident', result.data._id],
          (old: TApiResponse<TIncident> | undefined) => {
            if (!old) return old

            return {
              ...old,
              data: result.data
            }
          }
        )
      } else {
        // add new immediately
        queryClient.setQueryData(
          ['incidents'],
          (old: TApiResponse<TIncident[]> | undefined) => {
            if (!old) return old

            return {
              ...old,
              data: [result.data, ...old.data]
            }
          }
        )
      }

      queryClient.invalidateQueries({
        queryKey: ['incident-stats']
      })
      form.reset()
      onClose()
    } catch (err: any) {
      form.setError('root', {
        message: err.response?.data?.message || 'Save failed'
      })

      toast.error('Unable to save incident')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='
          glass-panel
          sm:p-6
          sm:max-w-2xl
          border-border/40
          '>
        <DialogHeader>
          <DialogTitle
            className='
              bg-linear-to-r
              from-primary
              via-brand
              to-pink-600
              bg-clip-text
              text-3xl
              font-black
              text-transparent
              '>
            {initial ? 'Update Incident' : 'Create Incident'}
          </DialogTitle>
        </DialogHeader>

        <form id='incident-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppInput
                    label='Title'
                    field={field}
                    fieldState={fieldState}
                    placeholder='Database outage'
                  />
                )}
              />

              <Controller
                name='service'
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppInput
                    label='Service'
                    field={field}
                    fieldState={fieldState}
                    placeholder='payment-api'
                  />
                )}
              />

              <Controller
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>

                    <Textarea {...field} placeholder='What happened?' />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='impact'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Impact</FieldLabel>

                    <Textarea
                      {...field}
                      placeholder='Affected customers, downtime...'
                    />
                  </Field>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* severity */}

              <Controller
                name='severity'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Severity</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {['low', 'medium', 'high', 'critical'].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              {/* engineer */}

              <Controller
                name='assignedTo'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Assign Engineer</FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Unassigned' />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value=''>Unassigned</SelectItem>

                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}

                            {u.isOnCall && ' (on-call)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <FieldError errors={[form.formState.errors.root]} />
            )}

            <Button
              type='submit'
              className='h-11 w-full bg-accent text-white uppercase font-semibold tracking-wide hover:bg-accent/90 cursor-pointer'
              disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Incident'}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
