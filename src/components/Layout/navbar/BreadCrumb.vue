<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { capitalize } from '@/utils/strings';
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter((segment) => segment);
  const breadcrumbs = [];

  breadcrumbs.push({
    title: 'Home',
    to: '/',
  });

  pathSegments.reduce((accPath, segment) => {
    const currentPath = `${accPath}/${segment}`;
    const matchedRoute = router.getRoutes().find((r) => r.path === currentPath);

    breadcrumbs.push({
      title: matchedRoute?.meta?.breadcrumb || segment.replace(/-/g, ' '),
      to: currentPath,
    });

    return currentPath;
  }, '');

  return breadcrumbs;
});
</script>

<template>
  <Breadcrumb class="p-4 my-2 rounded-sm">
    <BreadcrumbList>
      <BreadcrumbItem v-for="(crumb, index) in breadcrumbs" :key="index">
        <template v-if="index < breadcrumbs.length - 1">
          <RouterLink :to="crumb.to">
            {{ $t(capitalize(crumb.title)) }}
          </RouterLink>
        </template>
        <template v-else>
          <BreadcrumbPage>{{ $t(capitalize(crumb.title)) }}</BreadcrumbPage>
        </template>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
