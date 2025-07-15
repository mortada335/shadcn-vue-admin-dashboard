<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Admins</CardTitle>
        <Users class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.totalAdmins }}</div>
        <p class="text-xs text-muted-foreground">
          +{{ stats.newThisMonth }} from last month
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Active Admins</CardTitle>
        <UserCheck class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.activeAdmins }}</div>
        <p class="text-xs text-muted-foreground">
          {{ Math.round((stats.activeAdmins / stats.totalAdmins) * 100) }}% of total
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Inactive Admins</CardTitle>
        <UserX class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.inactiveAdmins }}</div>
        <p class="text-xs text-muted-foreground">
          {{ Math.round((stats.inactiveAdmins / stats.totalAdmins) * 100) }}% of total
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">New This Month</CardTitle>
        <TrendingUp class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.newThisMonth }}</div>
        <p class="text-xs text-muted-foreground">
          New admins added
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/types/admins'

defineProps<{
  stats: DashboardStats
}>()
</script>