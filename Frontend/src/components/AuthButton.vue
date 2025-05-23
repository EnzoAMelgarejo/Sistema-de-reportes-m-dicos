<template>
    <div>
        <div v-if="isLoading">Cargando...</div>
        <div v-else="">
            <button v-if="!isAuthenticated" @click="handleLoginWithRedirect">Login</button>
        
            <div v-else>
                <span>Hola, {{ user?.name }}</span>
                <button @click="handleLogout">Logout</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useAuth0 } from '@auth0/auth0-vue';
    import { watch } from 'vue';

    
    const {
        loginWithRedirect,
        logout,
        user,
        isAuthenticated,
        getAccessTokenSilently,
        isLoading,
    } = useAuth0()

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: 'http://localhost:5173',
                client_id: 'aIIxpZ7iA41mh8CLvP7cjviPQYYAF55P'
            }
        })
    }

    const handleLoginWithRedirect = () => {
        loginWithRedirect({
            loginParams:{
                audience: 'https://reports-api-endpoint/',
                scope: 'openid profile email'
            },
        })
    }

    watch(isAuthenticated, async (newVal) => {
        if (newVal) {
            try {
                const token = await getAccessTokenSilently({
                    audience: 'https://reports-api-endpoint/',
                    scope: 'openid profile email'
                });

                fetch('https://5deb-181-117-73-54.ngrok-free.app/m2m/sync', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                        auth0Id: user.value.sub, // <- esto viene del token
                        email: user.value.email,
                        name: user.value.name,
                  })
                })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));

                console.log('Access Token:', token)
                console.log('User Info (desde SDK):', user.value)
            } catch (err) {
                console.error('Error al obtener token o userinfo:', err);
            }
        }
    });


</script>