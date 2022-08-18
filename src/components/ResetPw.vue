<script setup>
import { reactive, ref } from 'vue'
// 表单动态绑定
const form = reactive({
    pwd: "",
    newpwd1: "",
    newpwd2: ""
})
// 异常动态绑定
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
// loading 动态绑定
const isLoading = ref(false)
// errorMsg 动态绑定
const errorMsg = ref("")
// 是否隐藏密码 动态绑定
const isHided = ref(true)

// post请求函数
function pwdInputed() {
    if (form.pwd.length == 0) {
        isError.pwd.isErr = true
        isError.pwd.errMsg = "初期パスワードを入力してください。"
    } else if (form.pwd != "000000") {
        isError.pwd.isErr = true
        isError.pwd.errMsg = "初期パスワードが正しくありません。"
    } else {
        isError.pwd.isErr = ""
        isError.pwd.errMsg = ""
    }
}
function newpwd1Inputed() {
    if (!/^\w{8,16}$/.test(form.newpwd1)) {
        isError.newpwd1.isErr = true
        isError.newpwd1.errMsg = "8〜16文字の半角英数字を入力してください。"
    } else {
        isError.newpwd1.isErr = ""
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
        isError.newpwd2.isErr = ""
        isError.newpwd2.errMsg = ""
    }
}

async function postData() {
    isLoading.value = true
    const data = { pwd: form.newpwd1.trim() }
    let response = await fetch('/api/resetpw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        let json = await response.json();
        isLoading.value = false
        if (json.success) {
            router.push('/login')
        } else {
            errorMsg.value = json.errorMsg
        }
    } else {
        isLoading.value = false
        errorMsg.value = "エラーが発生しました。"
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
                <p v-if="errorMsg.length != 0" class="error">{{ errorMsg }}</p>
                <h1>初期パスワード変更</h1>
                <p>パスワードを変更してください</p>
                <form>
                    <label for="pwd">初期パスワード</label>
                    <input v-model="form.pwd" :aria-invalid="isError.pwd.isErr" @input="pwdInputed"
                        @focusout="pwdInputed" type="password" id="pwd" name="pwd">
                    <small v-if="!isError.pwd.errMsg.length == 0">{{ isError.pwd.errMsg }}</small>
                    <label for="newpwd1">新パスワード</label>
                    <div class="eyeCon">
                        <input v-model="form.newpwd1" :aria-invalid="isError.newpwd1.isErr" @input="newpwd1Inputed"
                            @focusout="newpwd1Inputed" :type="isHided ? 'password' : 'text'" id="newpwd1" name="newpwd1"
                            placeholder="8〜16文字の半角英数字">
                        <small v-if="!isError.newpwd1.errMsg.length == 0">{{ isError.newpwd1.errMsg }}</small>
                        <svg @click="isHided = !isHided" v-if="isHided" class="eye" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24" fill="#000000">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
                        </svg>
                        <svg @click="isHided = !isHided" v-else class="eye" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24" fill="#000000">
                            <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                        </svg>
                    </div>
                    <label for="newpwd2">新パスワード（確認入力）</label>
                    <div class="eyeCon">
                        <input v-model="form.newpwd2" :aria-invalid="isError.newpwd2.isErr" @input="newpwd2Inputed"
                            @focusout="newpwd2Inputed" :type="isHided ? 'password' : 'text'" id="newpwd2" name="newpwd2"
                            placeholder="8〜16文字の半角英数字">
                        <small v-if="!isError.newpwd2.errMsg.length == 0">{{ isError.newpwd2.errMsg }}</small>
                        <svg @click="isHided = !isHided" v-if="isHided" class="eye" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24" fill="#000000">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
                        </svg>
                        <svg @click="isHided = !isHided" v-else class="eye" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24" fill="#000000">
                            <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                        </svg>
                    </div>
                    <button :aria-busy="isLoading" @click="postData" type="button"
                        :disabled="isError.pwd.isErr || isError.newpwd1.isErr || isError.newpwd2.isErr">変更</button>
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
            color: red

        h1
            margin-bottom: 0

        button
            margin-top: 20px

        small
            font-weight: 500
            color: red

input[type="password"][aria-invalid="true"], input[type="text"][aria-invalid="true"]
    background-image: none
.eyeCon
    position: relative
    .eye
        cursor: pointer
        fill: #454545
        width: 30px
        height: 30px
        position: absolute
        right: 5px
        top: 10px
        padding: 5px
        border-radius: 10px
        &:hover
            background-color: rgba(194, 193, 192, 0.2)
</style>