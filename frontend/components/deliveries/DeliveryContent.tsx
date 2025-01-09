"use client"

import { useState } from "react"
import { DeliveryTracking } from "./DeliveryTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from 'swr'
import { getBaseUrl } from "@/lib/api/config"

export function DeliveryContent() {
  const { data: tasks, error, isLoading } = useSWR('/api/v1/deliveries', async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/v1/deliveries`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch deliveries');
    }

    const json = await res.json();
    return json.data;
  });

  const stats = {
    pending: tasks?.filter((t: any) => t.status === 'pending').length || 0,
    inProgress: tasks?.filter((t: any) => t.status === 'in_progress').length || 0,
    completed: tasks?.filter((t: any) => t.status === 'completed').length || 0
  }

  return (
    <Tabs defaultValue="ongoing" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="ongoing" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
        </div>
        <DeliveryTracking 
          tasks={tasks?.filter((t: any) => t.status !== 'completed') || []}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="completed">
        <DeliveryTracking 
          tasks={tasks?.filter((t: any) => t.status === 'completed') || []}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  )
} 