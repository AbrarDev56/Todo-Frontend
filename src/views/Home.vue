<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

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
            console.log(error.response.data.error.message)
        })
}
function deleteCollection(collection_id) {
    axios.delete(`collections/${collection_id}`)
        .then(response => {
            let i = collections.value.map(data => data.id).indexOf(collection_id);
            collections.value.splice(i, 1);
            console.log(response.data.data)
        })
        .catch(error => {
            console.log(error.response.data.error.message)
        })
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
            console.log(error.response.data.error.message)
        })
}

const status = ref()
function updateTaskF(task_id) {
    axios.put(`tasks/${task_id}`, {
        data: {
            status: false,
        }
    })
        .then(response => {
            location.reload();
            console.log(response.data.data)
        })
        .catch(error => {
            console.log(error.response.data)
        })
}
function updateTaskT(task_id) {
    axios.put(`tasks/${task_id}`, {
        data: {
            status: true,
        }
    })
        .then(response => {
            location.reload();
            console.log(response.data.data)
        })
        .catch(error => {
            console.log(error.response.data.error)
        })
}

function deleteTask(task_id) {
    axios.delete(`tasks/${task_id}`)
        .then(response => {
            location.reload();
            console.log(response.data.data)
        })
        .catch(error => {
            console.log(error)
        })
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
                    <button @click="deleteCollection(collection.id)" type="button" class="btn btn-danger">Danger</button>
                </div>
                <ul class="list-group list-group-flush">
                    <li v-for="tasks in collection.attributes.tasks.data" class="list-group-item">
                        {{ tasks.id }}: {{ tasks.attributes.task }} -
                        <input :checked="tasks.attributes.status" class="form-check-input" type="checkbox" id="status" />
                        <label for="status">{{ tasks.attributes.status }}</label>
                        <br/>
                        <button @click="deleteTask(tasks.id)" type="button" class="btn btn-danger">Danger</button>
                        <div v-if="tasks.attributes.status === true">
                            <button @click="updateTaskF(tasks.id)" type="button" class="btn btn-secondary">False</button>
                        </div>
                        <div v-if="tasks.attributes.status === false">
                            <button @click="updateTaskT(tasks.id)" type="button" class="btn btn-secondary">True</button>
                        </div>
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