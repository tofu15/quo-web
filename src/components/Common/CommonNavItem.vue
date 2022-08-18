<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
    moduleName: String,
    url: String,
    haveSub: Boolean,
    subs: {
        type: Array
    }
})

import { ref } from 'vue'
const expanded = ref(false)
function nav1Click() {
    expanded.value = !expanded.value
}

</script>

<template>
    <div v-if="props.haveSub" class="item">
        <div class="nav1" @click="nav1Click">
            <img class="micon" :src="`/svg/${props.moduleName}.svg`" alt="icon">
            <span>{{ props.moduleName }}</span>
            <svg v-if="expanded" class="toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                aria-hidden="false" focusable="false">
                <path d="M8.353 4.498h-.707l-6.15 6.15.354.853h12.3l.354-.853-6.15-6.15z"></path>
            </svg>
            <svg v-else class="toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="false"
                focusable="false">
                <path d="M14.15 4.492H1.85l-.354.854 6.15 6.15h.707l6.15-6.15-.353-.854z"></path>
            </svg>
        </div>
        <div v-if="expanded" class="nav2Con">
            <RouterLink class="sub" v-for="sub in props.subs" :to="`${props.url}${sub.url}`">{{ sub.name }}</RouterLink>
        </div>
    </div>
    <div class="item" v-else>
        <RouterLink class="nav1" :to="props.url">
            <img class="micon" :src="`/svg/${props.moduleName}.svg`" alt="icon">
            <span>{{ props.moduleName }}</span>
        </RouterLink>

    </div>
</template>

<style lang="sass" scoped>
.item
    color: rgb(0, 43, 103)
    font-size: 16px
    font-weight: 500

.micon
    width: 20px

svg.toggle
    width: 12px
    color: rgb(0, 43, 103)
    position: absolute
    height: 40px
    right: 10px

.nav1, .sub
    color: inherit
    display: block
    text-decoration: none
    position: relative
    cursor: pointer
    height: 44px
    line-height: 44px
    padding: 0 20px
    margin-left: 4px
    margin-bottom: 4px
    border-bottom-left-radius: 50px
    border-top-left-radius: 50px
    &:hover
        background-color: rgb(233, 247, 251)
    >span
        padding-left: 15px
.sub
    margin-left: 40px
    font-size: 15px
    height: 40px
    line-height: 40px
    padding: 0 20px
    margin-bottom: 4px
    border-bottom-left-radius: 50px
    border-top-left-radius: 50px
.router-link-active
    cursor: auto
    font-weight: 700
    line-height: 42px
    background-color: rgb(236, 244, 255)
    color: rgb(0, 54, 129)
    border-top: 1px solid rgb(185, 214, 255)
    border-bottom: 1px solid rgb(185, 214, 255)
    border-left: 1px solid rgb(185, 214, 255)
.router-link-active.sub
    line-height: 38px
</style>
