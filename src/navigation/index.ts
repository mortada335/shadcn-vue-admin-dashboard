import type { NavigationHeader, NavigationItem } from "./types";

export default [
  {
    title: " ",
    header: true,
  },
  {
    title: "home",
    icon: 'tabler-home',
    to: '/',
  },
  {
    title: "Cars",
    icon: "tabler-car",
    to: "/cars"
  },
  {
    title: "Branches",
    icon: "tabler-building-store",
    to: "/branches"
  },
  {
    title:"Users",
    icon:"tabler-user",
    to:"/users"
  },
  {
    title: "Admins",
    icon: "tabler-user-shield",
    to:"/admins"
  }
  


] as (NavigationItem | NavigationHeader)[]
