<script setup>
    import { RouterView } from 'vue-router'
    import Moon from '@/components/icons/MoonIcon.vue'
    import Sun from '@/components/icons/SunIcon.vue'
    import { useColorMode, useCycleList } from '@vueuse/core'

    const mode = useColorMode({
        emitAuto: false
    })
    const { next } = useCycleList(['dark', 'light'], { initialValue: mode })
</script>

<template>
    <button @click="next()" type="button" class="btn position-absolute top-0 end-0 m-2">
        <ul v-if="mode === 'light'"><Moon/></ul>
        <ul v-if="mode === 'dark'"><Sun/></ul>
    </button>
    <div class="container">
        <RouterView />
    </div>
</template>

<style>
    .dark body {
        background-color: var(--bs-black);
    }
    .light body {
        background-color: var(--bs-light)
    }
</style>

<style scoped>
    .btn-bd-dark {
        --bs-btn-font-weight: 600;
        --bs-btn-color: var(--bs-white);
        --bs-btn-bg: var(--bs-dark);
    }

    .btn-bd-light {
        --bs-btn-font-weight: 600;
        --bs-btn-color: var(--bs-dark);
        --bs-btn-bg: var(--bs-light);
    }
</style>

