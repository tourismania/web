import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from "@/views/LoginView.vue";
import DealView from "@/views/Deals/DealView.vue";
import OfferView from "@/views/OfferView.vue";
import OffersListView from "@/views/OffersListView.vue";
import OfferEditView from "@/views/OfferEditView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/offers',
      name: 'offers',
      component: OffersListView,
    },
    {
      path: '/offer/new',
      name: 'offerNew',
      component: OfferEditView,
    },
    {
      path: '/offer/:id/edit',
      name: 'offerEdit',
      component: OfferEditView,
    },
    {
      path: '/offer/:id',
      name: 'offer',
      component: OfferView,
    },
    {
      path: '/deals',
      name: 'deals',
      component: DealView,
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