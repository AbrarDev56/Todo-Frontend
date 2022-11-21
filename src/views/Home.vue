<script setup>
    import { onMounted, ref } from 'vue'
    import axios from 'axios'
    import TrashCan from '@/components/icons/TrashIcon.vue'

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
    <h1 class="text-center mt-4">Todo App</h1>

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
                    <li v-for="tasks in collection.attributes.tasks.data" class="list-group-item border-bottom">
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
                    <button class="btn btn-outline-secondary" type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>