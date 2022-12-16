<script setup>
    import { RouterView } from 'vue-router'
    import Moon from '@/components/icons/MoonIcon.vue'
    import Sun from '@/components/icons/SunIcon.vue'
    import { useColorMode, useCycleList } from '@vueuse/core'

    const mode = useColorMode({
        emitAuto: false,
    })
    const { next } = useCycleList(['dark', 'light'], { initialValue: mode })
</script>

<template>
    <button @click="next()" type="button" class="btn position-absolute top-0 end-0 m-2">
        <ul v-if="mode === 'light'">
            <Moon />
        </ul>
        <ul v-if="mode === 'dark'">
            <Sun />
        </ul>
    </button>
    <div class="container">
        <RouterView />
    </div>
</template>

<style>
    .dark body {
        background-color: #121212;
    }
    /* .dark body {
        background-color: var(--bs-dark);
    } */

    .light body {
        background-color: var(--bs-light)
    }
</style>
