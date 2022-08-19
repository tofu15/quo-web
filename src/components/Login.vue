<script setup>
import { reactive, ref } from 'vue'
import router from '/router';

const form = reactive({
    eno: "",
    pwd: "",
    flag: false
})
const isEnoEmpty = ref("")
const isPwdEmpty = ref("")
const isLoading = ref(false)
const errorMsg = ref("")
const isHided = ref(true)

async function postData() {

    const flagdata = form.flag ? "1" : "0"
    isLoading.value = true

    let data = {
        eno: form.eno,
        pwd: form.pwd,
        flag: flagdata
    }

    let response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (response.ok) {
        let json = await response.json();
        isLoading.value = false
        if (json.success) {
            if (json.isNewUser) {
                router.push('/resetpw')
            } else {
                router.push('/')
            }
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
                <h1>ログイン</h1>
                <p>見積システムへようこそ</p>
                <form>
                    <label for="eno">ユーザーID</label>
                    <input :aria-invalid="isEnoEmpty" @focusout="isEnoEmpty = form.eno.length == 0 ? true : ''"
                        @input="isEnoEmpty = form.eno.length == 0 ? true : ''" v-model.trim="form.eno" type="text"
                        id="eno" name="eno">
                    <small v-if="isEnoEmpty">ユーザーIDは入力必須です。</small>
                    <label for="pwd">パスワード</label>
                    <div class="eyeCon">
                        <input :aria-invalid="isPwdEmpty" @focusout="isPwdEmpty = form.pwd.length == 0 ? true : ''"
                            @input="isPwdEmpty = form.pwd.length == 0 ? true : ''" v-model.trim="form.pwd"
                            :type="isHided ? 'password' : 'text'" id="pwd" name="pwd">
                        <small v-if="isPwdEmpty">パスワードは入力必須です。</small>
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
                    <label for="isremembered">
                        <input v-model="form.flag" type="checkbox" id="flag" name="flag" role="switch">
                        次回から自動的にログイン
                    </label>
                    <button :aria-busy="isLoading" @click="postData" type="button"
                        :disabled="form.eno.length == 0 || form.pwd.length == 0">ログイン</button>
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