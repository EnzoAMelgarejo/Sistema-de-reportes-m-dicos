import { useAuth0 } from "@auth0/auth0-vue"
import { computed } from 'vue'

export function useRoes() {
    const { user } = useAuth0();

    const roles = computed (() => {
        const claimKey = 'https://myapp.example/roles';
        const userValue = user.value as { [key: string]: any } | undefined;
        return userValue?.[claimKey] ?? [];
    });

    const hasRole = (role: string) => roles.value.includes(role);

    return { roles, hasRole };
}