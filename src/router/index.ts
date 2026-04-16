import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from "@/views/LoginView.vue";
import OfferView from "@/views/Offers/OfferView.vue";
import TourView from "@/views/TourView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tour',
      name: 'tour',
      component: TourView,
    },
    {
      path: '/offers',
      name: 'offers',
      component: OfferView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/:any(.*)',
      name: 'notFound',
      component: NotFoundView,
    },
  ],
})

export default router
