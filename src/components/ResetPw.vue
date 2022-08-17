<script setup>
import { reactive } from 'vue'
const form = reactive({
    pwd: "",
    newpwd1: "",
    newpwd2: ""
})
const isError = reactive({
    pwd: {
        isErr: "",
        errMsg: ""
    },
    newpwd1: {
        isErr: "",
        errMsg: ""
    },
    newpwd2: {
        isErr: "",
        errMsg: ""
    }
})
function pwdInputed() {
    if (form.pwd.length == 0) {
        isError.pwd.isErr = true
        isError.pwd.errMsg = "初期パスワードを入力してください。"
    } else if (form.pwd != "000000") {
        isError.pwd.isErr = true
        isError.pwd.errMsg = "初期パスワードが正しくありません。"
    } else {
        isError.pwd.isErr = false
        isError.pwd.errMsg = ""
    }
}
function newpwd1Inputed() {
    if (!/^\w{8,16}$/.test(form.newpwd1)) {
        isError.newpwd1.isErr = true
        isError.newpwd1.errMsg = "8〜16文字の半角英数字を入力してください。"
    } else {
        isError.newpwd1.isErr = false
        isError.newpwd1.errMsg = ""
    }
}
function newpwd2Inputed() {
    if (form.newpwd2.length == 0) {
        isError.newpwd2.isErr = true
        isError.newpwd2.errMsg = "新パスワード（確認）を入力してください。"
    } else if (!/^\w{8,16}$/.test(form.newpwd2)) {
        isError.newpwd2.isErr = true
        isError.newpwd2.errMsg = "8〜16文字の半角英数字を入力してください。"
    } else if (form.newpwd2 != form.newpwd1) {
        isError.newpwd2.isErr = true
        isError.newpwd2.errMsg = "新パスワードと再入力パスワードが一致しません。"
    } else {
        isError.newpwd2.isErr = false
        isError.newpwd2.errMsg = ""
    }
}
</script>

<template>
    <div class="app">
        <header>
            <a href="/"><img src="/images/logo.png" alt="logo"></a>

        </header>
        <main>
            <div>
                <p class="error"></p>
                <h1>初期パスワード変更</h1>
                <p>パスワードを変更してください</p>
                <form>
                    <label for="pwd">初期パスワード</label>
                    <input v-model="form.pwd" :aria-invalid="isError.pwd.isErr" @input="pwdInputed"
                        @focusout="pwdInputed" type="password" id="pwd" name="pwd">
                    <small v-if="!isError.pwd.errMsg.length == 0">{{ isError.pwd.errMsg }}</small>
                    <label for="newpwd1">新パスワード</label>
                    <input v-model="form.newpwd1" :aria-invalid="isError.newpwd1.isErr" @input="newpwd1Inputed"
                        @focusout="newpwd1Inputed" type="password" id="newpwd1" name="newpwd1"
                        placeholder="8〜16文字の半角英数字">
                    <small v-if="!isError.newpwd1.errMsg.length == 0">{{ isError.newpwd1.errMsg }}</small>
                    <label for="newpwd2">新パスワード（確認入力）</label>
                    <input v-model="form.newpwd2" :aria-invalid="isError.newpwd2.isErr" @input="newpwd2Inputed"
                        @focusout="newpwd2Inputed" type="password" id="newpwd2" name="newpwd2"
                        placeholder="8〜16文字の半角英数字">
                    <small v-if="!isError.newpwd2.errMsg.length == 0">{{ isError.newpwd2.errMsg }}</small>
                    <button type="button">変更</button>
                </form>

            </div>
        </main>
    </div>
</template>

<style lang="sass" scoped>
div.app
    background-repeat: no-repeat
    background-size: cover
    background-position: top
    background-image: url(/images/login-background.jpg)

header
    padding: 20px 40px
    img
        height: 26px
    a:hover
        opacity: 0.7
        transition: opacity var(--transition)

main
    min-height: calc( 100vh - 70px )
    display: flex
    align-items: center
    justify-content: center
    >div
        min-width: 480px
        padding: 50px 50px 20px
        border-radius: 15px
        box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
        background-color: #fff

        p.error
            display: none
            color: red

        h1
            margin-bottom: 0

        button
            margin-top: 20px

        small
            font-weight: 500
            color: red
            display: none
        input[aria-invalid="true"] + small
            display: block

</style>