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
    <div class="item" v-else>
        <RouterLink class="nav1" :to="props.url">
            <svg v-if="props.moduleName == 'ホーム'" class="micon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
            <svg v-if="props.moduleName == '製品管理'" class="micon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24">
                <g>
                    <rect fill="none" height="24" width="24" />
                </g>
                <g>
                    <path
                        d="M19.93,8.35l-3.6,1.68L14,7.7V6.3l2.33-2.33l3.6,1.68c0.38,0.18,0.82,0.01,1-0.36c0.18-0.38,0.01-0.82-0.36-1l-3.92-1.83 c-0.38-0.18-0.83-0.1-1.13,0.2L13.78,4.4C13.6,4.16,13.32,4,13,4c-0.55,0-1,0.45-1,1v1H8.82C8.4,4.84,7.3,4,6,4C4.34,4,3,5.34,3,7 c0,1.1,0.6,2.05,1.48,2.58L7.08,18H6c-1.1,0-2,0.9-2,2v1h13v-1c0-1.1-0.9-2-2-2h-1.62L8.41,8.77C8.58,8.53,8.72,8.28,8.82,8H12v1 c0,0.55,0.45,1,1,1c0.32,0,0.6-0.16,0.78-0.4l1.74,1.74c0.3,0.3,0.75,0.38,1.13,0.2l3.92-1.83c0.38-0.18,0.54-0.62,0.36-1 C20.75,8.34,20.31,8.17,19.93,8.35z M6,8C5.45,8,5,7.55,5,7c0-0.55,0.45-1,1-1s1,0.45,1,1C7,7.55,6.55,8,6,8z M11.11,18H9.17 l-2.46-8h0.1L11.11,18z" />
                </g>
            </svg>
            <span>{{ props.moduleName }}</span>
        </RouterLink>

    </div>
</template>

<style lang="sass" scoped>
.item
    color: rgb(0, 43, 103)
    font-size: 16px
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
.router-link-active
    cursor: auto
    font-weight: 700
    line-height: 42px
    background-color: rgb(236, 244, 255)
    color: rgb(0, 54, 129)
    border-top: 1px solid rgb(185, 214, 255)
    border-bottom: 1px solid rgb(185, 214, 255)
    border-left: 1px solid rgb(185, 214, 255)
</style>
