import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'

const app = createApp(App)

app.use(router)

app.use(
    createAuth0({
        domain: 'dev-ji8fh8tvtomeexci.us.auth0.com',
        clientId: 'aIIxpZ7iA41mh8CLvP7cjviPQYYAF55P',
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: 'https://reports-api-endpoint/',
        },
    })
)

app.mount('#app')
