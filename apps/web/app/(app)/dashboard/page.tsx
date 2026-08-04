'use client';

import Link from 'next/link';
import { FileText, Gauge, Plus, TrendingUp, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats, useResumes } from '@/hooks/use-resumes';
import { ResumeList } from '@/components/resume/resume-list';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: resumes, isLoading: resumesLoading } = useResumes();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of your resumes and job search progress.
          </p>
        </div>
        <Button asChild>
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" /> New resume
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total resumes"
          value={statsLoading ? null : (stats?.totalResumes ?? 0)}
        />
        <StatCard
          icon={Gauge}
          label="Average ATS score"
          value={statsLoading ? null : (stats?.averageAtsScore ?? '—')}
          suffix={stats?.averageAtsScore != null ? '%' : ''}
        />
        <StatCard
          icon={TrendingUp}
          label="Applications tracked"
          value={statsLoading ? null : (stats?.totalApplications ?? 0)}
        />
        <StatCard
          icon={UserCheck}
          label="Profile completion"
          value={statsLoading ? null : (stats?.profileCompletion ?? 0)}
          suffix="%"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your resumes</CardTitle>
        </CardHeader>
        <CardContent>
          {resumesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <ResumeList resumes={resumes ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = '',
}: {
  icon: typeof FileText;
  label: string;
  value: number | string | null;
  suffix?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 flex h-10 w-10 items-center justify-center rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-semibold">
            {value === null ? <Skeleton className="h-7 w-12" /> : `${value}${suffix}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
