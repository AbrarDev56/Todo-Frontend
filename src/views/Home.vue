<script setup>
    import { onMounted, ref } from 'vue'
    import axios from 'axios'
    import Profile from '@/components/icons/ProfileIcon.vue'
    import TrashCan from '@/components/icons/TrashIcon.vue'
    import Task from '@/components/icons/TaskIcon.vue'
    import Collection from '@/components/icons/CollectionIcon.vue'
    import Home from '@/components/icons/HomeIcon.vue'
    import { RouterLink, useRouter } from 'vue-router'
    import { useColorMode, useCycleList } from '@vueuse/core'
    import { useAuthStore } from "@/stores/auth"
    import { storeToRefs } from 'pinia';

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

    const collections = ref([])
    onMounted(() => {
        axios.get('collections?populate=*')
            .then(response => {
                collections.value = response.data.data
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    })

    const name = ref()
    function addCollection() {
        axios.post('collections?populate=*', {
            data: {
                name: name.value
            }
        })
            .then(response => {
                name.value = ''
                collections.value.push(response.data.data)
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    function deleteCollection(collection_id, collection_name) {
        if (confirm(`Do you really want to delete ${collection_name}? `)) {
            axios.delete(`collections/${collection_id}`)
                .then(response => {
                    let i = collections.value.map(data => data.id).indexOf(collection_id);
                    collections.value.splice(i, 1);
                    console.log(response.data.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const task = ref()
    function addTask(ct_id) {
        axios.post('tasks?populate=*', {
            data: {
                task: task.value,
                collections: ct_id
            }
        })
            .then(response => {
                task.value = ''
                collections.value.push(response.data.data)
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const status = ref()
    function updateTask(task_id) {
        axios.put(`tasks/${task_id}`, {
            data: {
                status: status.value,
            }
        })
            .then(response => {
                location.reload();
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    function deleteTask(task_id, task_name) {
        if (confirm(`Do you really want to delete ${task_name}? `)) {
            axios.delete(`tasks/${task_id}`)
                .then(response => {
                    location.reload();
                    console.log(response.data.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<template>
    <div class="d-flex mt-4">
        <div class="d-flex flex-column flex-shrink-0 me-4" style="width: 280px; height: 95vh;">
            <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span class="fs-4">Task App</span>
            </a>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <RouterLink to="/" class="nav-link link-dark">
                        <Home class="me-2"/>
                        Home
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/" class="nav-link link-dark">
                        <Collection class="me-2"/>
                        Collections
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/" class="nav-link link-dark">
                        <Task class="me-2"/>
                        Tasks
                    </RouterLink>
                </li>
            </ul>
            <hr>
            <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/signup">Register</RouterLink>
            <div v-if="isAuthenticated" class="dropdown">
                <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <Profile />
                    <strong class="ms-2">{{ profile.username }}</strong>
                </a>
                <ul class="dropdown-menu text-small shadow">
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
                    <!-- <li><button class="btn btn-danger" @click="Logout()">Logout</button></li> -->
                    <li><a class="dropdown-item" type="button" @click="Logout()">Sign out</a></li>
                </ul>
            </div>
        </div>


        <div>
            <form v-on:submit.prevent="addCollection">
                <div class="input-group mb-3">
                    <input v-model="name" class="form-control" type="text" placeholder="Create a new collection">
                    <button class="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>

            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div v-for="collection in collections" v-bind:key="collection.id" class="col">
                    <div class="card" style="max-width: 400px;">
                        <div class="card-header">
                            {{ collection.id }}: {{ collection.attributes.name }}
                            <a @click="deleteCollection(collection.id, collection.attributes.name)" type="button" class="text-dark float-end">
                                <TrashCan />
                            </a>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li v-for="tasks in collection.attributes.tasks.data" class="list-group-item">
                                <input @change="updateTask(tasks.id)" v-model="status" :checked="tasks.attributes.status" class="form-check-input" type="checkbox" id="status" />
                                <span v-if="tasks.attributes.status === true" class="text-decoration-line-through ms-2">{{ tasks.attributes.task }}</span>
                                <span v-else class="ms-2">{{ tasks.attributes.task }}</span>
                                <a @click="deleteTask(tasks.id, tasks.attributes.task)" type="button" class="text-dark float-end">
                                    <TrashCan />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <form v-on:submit="addTask(collection.id)">
                        <div class="input-group mb-3">
                            <input v-model.lazy="task" class="form-control" type="text" placeholder="Add task">
                            <button class="btn btn-primary" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>


</template>

<style>
    .dark body {
        background-color: #121212;
    }

    /* .dark body {
background-color: var(--bs-dark);
} */

    /* .light body {
background-color: var(--bs-light)
} */
    .dark h1 {
        color: var(--bs-light)
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

    .dark input {
        background-color: var(--bs-dark);
        border: 1px solid var(--bs-black);
    }
</style>