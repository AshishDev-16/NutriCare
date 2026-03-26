"use client"

import { useState } from "react"
import { DeliveryTracking } from "./DeliveryTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from 'swr'
import { getBaseUrl } from "@/lib/api/config"

import { motion } from "framer-motion"
import { Package, Clock, CheckCircle2 } from "lucide-react"

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-none shadow-lg bg-white dark:bg-[#0d1c2e] group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Awaiting Dispatch</p>
                <div className="text-3xl font-black text-slate-700 dark:text-slate-200 mt-1">{stats.pending}</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg bg-white dark:bg-[#0d1c2e] group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">In Transit</p>
                <div className="text-3xl font-black text-slate-700 dark:text-slate-200 mt-1">{stats.inProgress}</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg bg-white dark:bg-[#0d1c2e] group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Successful Drops</p>
                <div className="text-3xl font-black text-slate-700 dark:text-slate-200 mt-1">{stats.completed}</div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ongoing" className="space-y-6">
        <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="ongoing" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2b3c] data-[state=active]:shadow-sm px-6">Live Tracking</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2b3c] data-[state=active]:shadow-sm px-6">Archived Logs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ongoing" className="mt-0">
          <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200/50 to-transparent">
            <div className="bg-white dark:bg-[#0d1c2e] rounded-[2.4rem] overflow-hidden shadow-xl border border-white/20">
              <DeliveryTracking 
                tasks={tasks?.filter((t: any) => t.status !== 'completed') || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200/50 to-transparent">
            <div className="bg-white dark:bg-[#0d1c2e] rounded-[2.4rem] overflow-hidden shadow-xl border border-white/20">
              <DeliveryTracking 
                tasks={tasks?.filter((t: any) => t.status === 'completed') || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
 