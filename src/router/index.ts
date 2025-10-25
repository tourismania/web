import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import TravelVoucherView from "@/views/TravelVoucherView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/travel-voucher',
      name: 'travel-voucher',
      component: TravelVoucherView,
    },
    {
      path: '/:any(.*)',
      name: 'notFound',
      component: NotFoundView,
    },
  ],
})

export default router
