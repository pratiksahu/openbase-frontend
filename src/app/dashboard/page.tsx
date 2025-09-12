'use client';

import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

import { DashboardLayout } from '@/components/layout/DashboardLayout';


export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="dashboard">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border p-6"
              data-testid="dashboard-widget"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`flex items-center text-xs ${
                      stat.change.startsWith('+')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    <ArrowTrendingUpIcon className="mr-1 h-3 w-3" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <stat.icon className="text-primary h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-semibold">Revenue Overview</h3>
            <div className="text-muted-foreground flex h-64 items-center justify-center">
              Chart Component Placeholder
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 font-semibold">User Activity</h3>
            <div className="text-muted-foreground flex h-64 items-center justify-center">
              Chart Component Placeholder
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-muted-foreground text-xs">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const stats = [
  {
    label: 'Total Users',
    value: '1,234',
    change: '+12%',
    icon: UsersIcon,
  },
  {
    label: 'Revenue',
    value: '$12,345',
    change: '+8%',
    icon: CurrencyDollarIcon,
  },
  {
    label: 'Conversions',
    value: '23.5%',
    change: '+2.4%',
    icon: ArrowTrendingUpIcon,
  },
  {
    label: 'Page Views',
    value: '45,678',
    change: '+15%',
    icon: ChartBarIcon,
  },
];

const activities = [
  {
    description: 'New user registered: john.doe@example.com',
    time: '2 minutes ago',
  },
  {
    description: 'Payment received from customer #1234',
    time: '15 minutes ago',
  },
  {
    description: 'System backup completed successfully',
    time: '1 hour ago',
  },
  {
    description: 'New feature deployed to production',
    time: '2 hours ago',
  },
];