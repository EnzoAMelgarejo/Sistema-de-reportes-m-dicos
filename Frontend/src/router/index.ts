import { createRouter, createWebHistory } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

const routes = [{
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
},
{
    path: '/reports',
    name: 'Reports',
    component: () => import ('../views/Reports.vue'),
},
]

const router = createRouter ({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const {isAuthenticated, loginWithRedirect, isLoading} = useAuth0();

    if(isLoading.value) { 
        next(false);
        return;
    }

    if(to.meta.requiresAuth && !isAuthenticated.value) {
        await loginWithRedirect({
            appState: { targetUrl: to.fullPath },
        });
        next(false);
    } else {
        next();
    }
})

export default router;