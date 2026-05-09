import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from "@/views/LoginView.vue";
import DealView from "@/views/Deals/DealView.vue";
import OfferView from "@/views/OfferView.vue";
import OffersListView from "@/views/OffersListView.vue";
import OfferEditView from "@/views/OfferEditView.vue";
import { useAuthStore } from '@/stores/auth'

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
      meta: { requiresAuth: true },
    },
    {
      path: '/offer/new',
      name: 'offerNew',
      component: OfferEditView,
      meta: { requiresAuth: true },
    },
    {
      path: '/offer/:id/edit',
      name: 'offerEdit',
      component: OfferEditView,
      meta: { requiresAuth: true },
    },
    {
      path: '/offer/:id',
      name: 'offer',
      component: OfferView,
      meta: { requiresAuth: true },
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

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.token) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
})

export default router