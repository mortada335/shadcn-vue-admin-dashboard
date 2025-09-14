<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">{{t("total_admins")}}</CardTitle>
        <Users class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.totalAdmins }}</div>
        <p class="text-xs text-muted-foreground">
          +{{ stats.newThisMonth }} {{t("from_last_month")}}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">{{t("active_admins")}}</CardTitle>
        <UserCheck class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.activeAdmins }}</div>
        <p class="text-xs text-muted-foreground">
          {{ Math.round((stats.activeAdmins / stats.totalAdmins) * 100) }}% {{t("of_total")}}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">{{t("inactive_admins")}}</CardTitle>
        <UserX class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.inactiveAdmins }}</div>
        <p class="text-xs text-muted-foreground">
          {{ Math.round((stats.inactiveAdmins / stats.totalAdmins) * 100) }}% {{t("of_total")}}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">{{t("new_this_month")}}</CardTitle>
        <TrendingUp class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.newThisMonth }}</div>
        <p class="text-xs text-muted-foreground">
          {{t("new_admins_added")}}
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/types/admins'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
defineProps<{
  stats: DashboardStats
}>()
</script>