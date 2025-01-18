import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import StatsCard from './_components/StatsCard'
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react'
import { GetStatsCardValues } from '@/actions/dashboard/getStatsCardValues';
import { Period } from '@/types/analytics'
import { Skeleton } from '@/components/ui/skeleton'
import PeriodSelector from './_components/PeriodSelector'
import { GetPeriods } from '@/actions/dashboard/getPeriods'
import { GetWorkflowExecutionStats } from '@/actions/dashboard/getWorkflowExecutionStats'
import ExecutionStatusChart from './_components/ExecutionStatusChart'
import { GetCreditsUsageInPeriod } from '@/actions/dashboard/getCreditsUsageInPeriod'
import CreditsUsageChart from './billing/_components/ExecutionStatusChart'

async function Page({ searchParams }: { searchParams: Promise<{ month?: string, year?: string }> }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className='h-full py-6 flex flex-col gap-4'>
        <Suspense fallback={<StatsCardsSkeleton />} >
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className='h-[300px] w-full' />} >
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className='h-[300px] w-full' />} >
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const periods = await GetPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

async function StatsCardsSkeleton() {
  return (
    <div className='grid gap-3 lg:gap-8 lg:grid-cols-3'>
      {[1, 2, 3].map((i) =>
        <Skeleton className='h-[120px]' key={i} />
      )}
    </div>
  )
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardValues(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}

async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod);
  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credits consumed in selected period"
    />
  );
}
export default Page;