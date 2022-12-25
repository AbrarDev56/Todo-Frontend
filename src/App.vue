<script setup>
    import { onMounted, ref } from 'vue'
    import { RouterLink, RouterView, useRouter } from 'vue-router'

    import axios from 'axios'
    import { useColorMode, useCycleList } from '@vueuse/core'

    import { storeToRefs } from 'pinia';
    import { useAuthStore } from "@/stores/auth"

    import Profile from '@/components/icons/ProfileIcon.vue'
    import Task from '@/components/icons/TaskIcon.vue'
    import Collection from '@/components/icons/CollectionIcon.vue'
    import Home from '@/components/icons/HomeIcon.vue'

    const { isAuthenticated } = storeToRefs(useAuthStore())
    const authStore = useAuthStore();
    const { removeToken } = authStore
    const router = useRouter()
    
    const profile = ref('')
    onMounted(() => {
        axios.get('users/me', {
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        })
            .then(response => {
                profile.value = (response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    })

    function Logout() {
        removeToken()
        router.push('login')
    }

    const mode = useColorMode({
        emitAuto: false,
    })
    const { next } = useCycleList(['dark', 'light'], { initialValue: mode })
</script>

<template>
    <div class="d-flex">
        <div v-if="!['login', 'signup'].includes($route.name)" class="d-flex flex-column flex-shrink-0 me-4 container-fluid sidebar" style="width: 280px; height: 100vh;">
            <a href="/" class="d-flex align-items-center mt-3 mb-3 mb-md-0 me-md-auto text-decoration-none">
                <span class="fs-4">Task App</span>
            </a>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <RouterLink to="/" class="nav-link">
                        <Home class="me-2" />
                        Home
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/collections" class="nav-link">
                        <Collection class="me-2" />
                        Collections
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/tasks" class="nav-link">
                        <Task class="me-2" />
                        Tasks
                    </RouterLink>
                </li>
            </ul>
            <hr>
            <a v-if="!isAuthenticated" @click="next()" type="button">
                <span class="ml-2 text-capitalize">{{ mode }}</span>
            </a>
            <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/signup" class="mb-3">Register</RouterLink>

            <div v-if="isAuthenticated" class="dropdown mb-3">
                <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <Profile />
                    <strong class="ms-2">{{ profile.username }}</strong>
                </a>
                <ul class="dropdown-menu text-small">
                    <li>
                        <a @click="next()" type="button" class="btn">
                            <div class="text-capitalize" v-if="mode === 'light'">
                                {{ mode }}
                            </div>
                            <div class="text-capitalize" v-if="mode === 'dark'">
                                {{ mode }}
                            </div>
                        </a>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a @click="Logout()" class="dropdown-item" type="button">Sign out</a></li>
                </ul>
            </div>
        </div>


        <div class="container-fluid">
            <RouterView />
        </div>

    </div>
</template>

<style>
    .light a {
        color: var(--bs-dark)
    }

    .light div.sidebar {
        background-color: var(--bs-light);
    }

    .dark body {
        background-color: #121212;
    }

    .dark h1 {
        color: var(--bs-light)
    }

    .dark a {
        color: var(--bs-light)
    }

    .dark span {
        color: var(--bs-light)
    }

    .dark ul.dropdown-menu {
        background-color: var(--bs-dark)
    }

    .dark div.card {
        --bs-card-border-color: var(--bs-black);
        --bs-card-cap-bg: var(--bs-dark);
        --bs-card-cap-color: var(--bs-light);
        --bs-card-color: var(--bs-light);
        --bs-card-bg: var(--bs-dark);
        --bs-card-cap-bg: #101214;
    }

    .dark ul.list-group {
        --bs-list-group-color: var(--bs-white);
        --bs-list-group-border-width: 1px;
        --bs-list-group-bg: var(--bs-dark);
        --bs-list-group-border-color: var(--bs-black);
    }

    .dark svg {
        color: var(--bs-white);
    }

    .dark hr {
        color: var(--bs-white);
    }

    .dark input {
        background-color: var(--bs-dark);
        border: 1px solid var(--bs-black);
    }

    .dark div.sidebar {
        background-color: var(--bs-dark);
    }
</style>

