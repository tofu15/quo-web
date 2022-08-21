<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
    title: String,
    urls: {
        type: Array
    }
})
</script>

<template>
    <div>
        <h1>{{ props.title }}</h1>
        <p>
            <span v-for="url in props.urls">
                <RouterLink v-if="url.isUrl" :to="url.url">{{ url.text }}</RouterLink>
                <span v-else>{{ url.text }}</span>
            </span>
        </p>
    </div>
</template>

<style lang="sass" scoped>
div
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    align-items: center
    padding-top: 10px
    margin-bottom: 20px
    h1
        margin: 0
    p
        margin: 0
        font-weight: 500
        font-size: 16px
</style>
