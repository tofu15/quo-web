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
</script>

<template>
    <div v-if="props.haveSub" class="item">
        <div class="nav1" @click="expanded = !expanded">
            <svg class="micon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
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
            <div v-for="sub in props.subs">{{ sub }}</div>
        </div>
    </div>
    <div v-else>
        <RouterLink class="nav1" :to="props.url">
            <svg class="micon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
            <span>{{ props.moduleName }}</span>
        </RouterLink>

    </div>
</template>

<style lang="sass" scoped>
.item
    color: rgb(0, 43, 103)
    font-size: 14px
    font-weight: 500

svg.micon
    fill: rgb(0, 81, 195)
    width: 20px

svg.toggle
    width: 12px
    fill: rgb(0, 43, 103)
    position: absolute
    height: 40px
    right: 5px

.nav1
    color: inherit
    display: block
    text-decoration: none
    position: relative
    cursor: pointer
    height: 40px
    line-height: 40px
    padding: 0 20px
    margin-left: 4px
    margin-bottom: 4px
    border-bottom-left-radius: 50px
    border-top-left-radius: 50px
    &:hover
        background-color: rgb(233, 247, 251)
    >span
        padding-left: 15px
</style>
