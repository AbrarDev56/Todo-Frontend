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

const task = ref()
function addTask() {
    axios.post('tasks?populate=*', {
        data: {
            task: task.value,
            collections: 4
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
</script>

<template>
    <h1 class="text-center mt-4">Todo App</h1>
    
    <form v-on:submit="addCollection">
        <div class="input-group mb-3">
            <input v-model="name" class="form-control" type="text" placeholder="Create a new collection">
            <button class="btn btn-primary" type="button">Submit</button>
        </div>
    </form>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div v-for="collection in collections" v-bind:key="collection.id" class="col">
            <div class="card" style="max-width: 400px;">
                <div class="card-header">
                    {{ collection.attributes.name }}
                </div>
                <ul class="list-group list-group-flush">
                    <li v-for="tasks in collection.attributes.tasks.data" class="list-group-item">
                        {{ tasks.id }}: {{ tasks.attributes.task }} -
                        <input v-model="tasks.attributes.status" class="form-check-input" type="checkbox" id="status" />
                        <label for="status">{{ tasks.attributes.status }}</label>
                    </li>
                </ul>
            </div>
            <form v-on:submit="addTask">
                <div class="input-group mb-3">
                    <input v-model="task" class="form-control" type="text" placeholder="Add task">
                    <button class="btn btn-outline-secondary" type="button">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>