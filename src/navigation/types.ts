import type { RouterLinkProps } from "vue-router"

export interface NavigationItem {
  title: string,
  to: RouterLinkProps['to']
  icon: string
  children?: NavigationChildItem[]
  permission?: string,
}

export interface NavigationHeader {
  title: string,
  icon?: string
  header: true
}

export interface NavigationChildItem {
  title: string,
  to: RouterLinkProps['to']
  icon?: string,
  permission?: string,
}
