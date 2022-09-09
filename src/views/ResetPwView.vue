<script setup>
import { reactive, ref } from 'vue'
import router from '/router'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// 表单动态绑定
const form = reactive({
    pwd: "",
    newpwd1: "",
    newpwd2: "",
    isPwd: true,
    isLoading: false
})

// post请求函数
function postData() {
    form.isLoading = true

    const data = { newpwd: form.newpwd1 }

    fetch('/api/resetpw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            router.push('/login')
        } else {
            throw new Error(json.message);
        }
    }).catch((error) => {
        form.isLoading = false
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}
</script>

<template>
    <div class="app">
        <header>
            <a href="/"><img src="/images/logo.png" alt="logo"></a>

        </header>
        <main>
            <div>
                <h1>初期パスワード変更</h1>
                <p>パスワードを変更してください</p>
                <!-- <form>
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
                        :disabled="(isError.pwd.isErr === true || isError.newpwd1.isErr === true || isError.newpwd2.isErr === true || form.pwd.length == 0 || form.newpwd1.length == 0 || form.newpwd2.length == 0) ? true : false">変更</button>
                </form> -->
                <q-form @submit="postData" class="q-gutter-md">
                    <q-input outlined :type="form.isPwd ? 'password' : 'text'" v-model.trim="form.pwd" label="初期パスワード"
                        lazy-rules :rules="[
                          val => val && val.length > 0 || '初期パスワードを入力してください。',
                          val => val == '000000' || '初期パスワードが正しくありません。'
                        ]">
                        <template v-slot:append>
                            <q-icon :name="form.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                @click="form.isPwd = !form.isPwd" />
                        </template>
                    </q-input>

                    <q-input outlined :type="form.isPwd ? 'password' : 'text'" v-model.trim="form.newpwd1"
                        label="新パスワード" lazy-rules :rules="[
                        val => val && val.length > 0 || '新パスワードを入力してください。',
                        val => /^\w{8,16}$/.test(val) || '8〜16文字の半角英数字を入力してください。']">
                        <template v-slot:append>
                            <q-icon :name="form.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                @click="form.isPwd = !form.isPwd" />
                        </template>
                    </q-input>

                    <q-input outlined :type="form.isPwd ? 'password' : 'text'" v-model.trim="form.newpwd2"
                        label="新パスワード（確認入力）" lazy-rules :rules="[
                          val => val && val.length > 0 || '新パスワード（確認）を入力してください。',
                          val => /^\w{8,16}$/.test(val) || '8〜16文字の半角英数字を入力してください。',
                          val => val === form.newpwd1 || '新パスワードと再入力パスワードが一致しません。'
                        ]">
                        <template v-slot:append>
                            <q-icon :name="form.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                @click="form.isPwd = !form.isPwd" />
                        </template>
                    </q-input>

                    <div>
                        <q-btn :loading="form.isLoading" label="変更" type="submit" color="primary"
                            style="width: 100%;" />
                    </div>
                </q-form>
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
        h1
            line-height: 1
            margin-bottom: 0
        p
            margin-top: 15px
            margin-bottom: 30px
</style>