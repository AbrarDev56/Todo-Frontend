<script setup>
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue'
    import axios from 'axios'
    import TrashCan from '@/components/icons/TrashIcon.vue'

    import { useAuthStore } from "@/stores/auth"

    const authStore = useAuthStore();

    const route = useRoute();

    const id = ref()
    const name = ref()
    const tasks = ref([])
    onMounted(() => {
        axios.get('users/me', {
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        })
            .then(response => {
                profile_id.value = response.data.id
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })

        const collection_detail = route.params.collection_detail
        axios.get(`collections/${collection_detail}?populate=*`, {
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        })
            .then(response => {
                id.value = response.data.data.id
                name.value = response.data.data.attributes.name
                tasks.value = response.data.data.attributes.tasks.data
                console.log('data', response.data.data)
                console.log('tasks ', response.data.data.attributes.tasks.data)
            })
            .catch(error => {
                console.log(error)
            })
    })

    function deleteCollection(collection_id, collection_name) {
        if (confirm(`Do you really want to delete ${collection_name}? `)) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
            axios.delete(`collections/${collection_id}`)
                .then(response => {
                    location.replace('/')
                    console.log(response.data.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const task = ref()
    const profile_id = ref('')
    function addTask(ct_id) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
        axios.post('tasks?populate=*', {
            data: {
                task: task.value,
                collections: ct_id,
                user: {
                    id: profile_id.value
                }
            }
        })
            .then(response => {
                task.value = ''
                tasks.value.push(response.data.data)
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const status = ref()
    function updateTask(task_id) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
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
            axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
            axios.delete(`tasks/${task_id}`)
                .then(response => {
                    let i = tasks.value.map(data => data.id).indexOf(task_id);
                    tasks.value.splice(i, 1);
                    console.log(response.data.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<template>
    <a @click="deleteCollection(id, name)" type="button" class="text-dark float-end">
        <TrashCan />
    </a>

    <h1 class="text-center text-capitalize">{{ name }}</h1>

    <form v-on:submit.prevent="addTask(id)">
        <div class="input-group mb-3">
            <input v-model="task" class="form-control" type="text" placeholder="Add task">
            <button class="btn btn-primary" type="submit">Submit</button>
        </div>
    </form>

    <div v-for="task in tasks" v-bind:key="task.id" class="mb-2">
        <div class="card">
            <div class="card-body text-center">
                <input @change="updateTask(task.id)" v-model.lazy="status" :checked="task.attributes.status" class="form-check-input float-start" type="checkbox" id="status" />
                <span v-if="task.attributes.status" class="text-decoration-line-through">{{ task.attributes.task }}</span>
                <span v-else>{{ task.attributes.task }}</span>
                <a @click="deleteTask(task.id, task.attributes.task)" type="button" class="text-dark float-end">
                    <TrashCan />
                </a>
            </div>
        </div>
    </div>
</template>