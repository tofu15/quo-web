<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const expanded = ref(false)

function userBtnClicked() {
    expanded.value = !expanded.value
}
</script>

<template>
    <header class="commonHeader">
        <RouterLink class="logo" to="/"><img src="/images/logo.png" alt="logo"></RouterLink>
        <div class="space"></div>
        <div class="name">営業部</div>
        <div class="name">部長</div>
        <div class="name">山田太郎</div>
        <div class="userCon">
            <div :aria-expanded="expanded" class="userBtn" @click="userBtnClicked">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path
                            d="M9.806 7.452a3.25 3.25 0 11-3.612-5.404 3.25 3.25 0 013.612 5.404zM6.793 9h2.42a5.442 5.442 0 013.736 1.475 4.908 4.908 0 011.551 3.55l-.5.475H2l-.5-.475a4.908 4.908 0 011.552-3.552A5.443 5.443 0 016.792 9z">
                        </path>
                    </svg>
                </div>
                <div>
                    <svg class="popupBtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M14.15 4.492H1.85l-.354.854 6.15 6.15h.707l6.15-6.15-.353-.854z"></path>
                    </svg>
                </div>
            </div>
            <div class="popup">
                <a href="/">個人設定</a>
                <a href="/">ログアウト</a>
            </div>
        </div>
    </header>
</template>

<style lang="sass" scoped>
header.commonHeader
    z-index: 999
    position: fixed
    top: 0
    left: 0
    right: 0
    background-color: #fbfbfc
    color: rgb(49, 49, 49)
    height: 60px
    border-bottom: 1px solid rgb(217, 217, 217)
    display: flex
    align-items: center
    justify-content: space-between
    >.space
        flex: 1 0
    >.name
        font-weight: 500
        padding: 0 10px
    >a.logo
        display: block
        margin: 0 20px
        transition: opacity var(--transition)
        &:hover
            opacity: 0.7
        >img
            height: 25px
    
    .userCon
        position: relative
        height: 100%
    
    .userBtn
        cursor: pointer
        height: 100%
        display: flex
        align-items: center
        margin-right: 10px
        padding: 0 10px
        &:hover
            background-color: rgb(242, 242, 242)
        >div
            margin-right: 5px
        svg
            height: 20px
            fill: rgb(89, 89, 89)
        svg.popupBtn
            height: 15px

// popup
.popup
    display: none
.userBtn[aria-expanded="true"]
    background-color: rgb(242, 242, 242)
    +.popup
        position: absolute
        background-color: #fff
        display: flex
        flex-direction: column
        right: 10px
        width: 150px
        border-radius: 0px 0px 3px 3px
        box-shadow: rgba(0, 0, 0, 0.15) 2px 4px 20px 0px
        border: 1px solid rgb(182, 182, 182)
        >a
            color: inherit
            text-decoration: none
            padding: 10px 0
            padding-left: 15px
            &:hover
                background-color: rgb(242, 242, 242)
    
</style>
