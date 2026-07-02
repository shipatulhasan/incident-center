import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Clock3,
  Plus,
  Search,
  ShieldAlert,
  Users
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import DashboardHeader from './components/DashboardHeader'

// import CreateIncidentDialog from "./components/CreateIncidentDialog";
import MetricCard from './components/MatricCard'
import IncidentColumn from './components/IncidentColumn'
import { useAppQuery } from '@/api/useAppQuery'
import DashboardSkeleton from './components/DashboardSkeleton'
import { useQueryClient } from '@tanstack/react-query'
import { useAppMutation } from '@/api/useAppMutation'

const columns = [
  {
    key: 'open',
    title: 'Open',
    hint: 'Drop new incidents here'
  },
  {
    key: 'investigating',
    title: 'Investigating',
    hint: 'Active debugging'
  },
  {
    key: 'resolved',
    title: 'Resolved',
    hint: 'Ready for postmortem'
  }
]

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { data: incidentsData, isPending: incidentsLoading } = useAppQuery<
    TApiResponse<Record<string, any>[]>
  >({
    queryKey: ['incidents'],
    url: '/incidents'
  })
  const { data: statsData, isPending: statsLoading } = useAppQuery<
    TApiResponse<Record<string, any>>
  >({
    queryKey: ['incident-stats'],
    url: '/incidents/stats'
  })

  const { data: usersData, isPending: usersLoading } = useAppQuery<
    TApiResponse<{
      users: TIUser[]
    }>
  >({
    queryKey: ['users'],
    url: '/auth/users'
  })

  const queryClient = useQueryClient();

const updateStatus = useAppMutation<
  TApiResponse<{ incident: TIncident }>,
  { status: any }
  >({
   
  method: "patch",
  });
  const handleStatusChange = async (
  id: string,
  status: any,
) => {
  const updateResult = await updateStatus.mutateAsync({
    url: `/incidents/${id}`,
    data: {
      status,
    },
  });

 queryClient.setQueryData(
  ["incidents"],
  (old: TApiResponse<TIncident & {_id:string}[]> | undefined) => {
    if (!old) return old;

    return {
      ...old,
      data: old.data.map((incident) =>
        incident._id === id
          ? {
              ...incident,
              status,
            }
          : incident
      ),
    };
  }
);

  queryClient.invalidateQueries({
    queryKey: ["incident-stats"],
  });
};

  // if (dashboardError) {
  //   return <DashboardError />;
  // }

  /**
   * Replace with TanStack Query
   */

  const incidents: Record<string, any>[] = incidentsData?.data!
  const users: Record<string, any>[] = usersData?.data.users!

  const stats: Record<string, any> = statsData?.data!


  const metrics = [
    {
      title: 'Total Incidents',
      value: stats?.total,
      icon: AlertTriangle,
      trend: 12
    },
    {
      title: 'Average MTTR',
      value: `${stats?.avgMttr}m`,
      icon: Clock3,
      trend: -8
    },
    {
      title: 'Critical',
      value: stats?.bySeverity.critical,
      icon: ShieldAlert
    },
    {
      title: 'On Call',
      value: stats?.onCall.length,
      icon: Users
    }
  ]

  const filtered = useMemo(() => {
    return incidents?.filter((incident) =>
      `${incident?.title} ${incident?.service} ${incident?.severity}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  }, [incidents, query])

  const dashboardLoading = incidentsLoading || statsLoading || usersLoading

  // const dashboardError =
  //   incidentsError ||
  //   statsError ||
  //   usersError;

  if (dashboardLoading) {
    return <DashboardSkeleton />
  }

  return (
    <section className='space-y-8'>
      {/* <DashboardHeader /> */}

      <div className='flex flex-col gap-4 lg:flex-row'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

          <Input
            className='pl-10 h-11'
            placeholder='Search incident, service or severity...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Button size='lg' onClick={() => setOpen(true)}>
          <Plus className='mr-2 size-4' />
          Create Incident
        </Button>
      </div>

      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            icon={<metric.icon className='size-5' />}
          />
        ))}
      </div>

      <div className='grid gap-6 xl:grid-cols-3'>
        {columns?.map((column) => (
          <IncidentColumn
            key={column.key}
            title={column.title}
            hint={column.hint}
            status={column.key}
            incidents={filtered.filter((i: any) => i?.status === column.key)}
            onDropIncident={handleStatusChange}
          />
        ))}
      </div>

      {/* <CreateIncidentDialog
        open={open}
        onOpenChange={setOpen}
        users={users}
      /> */}
    </section>
  )
}
