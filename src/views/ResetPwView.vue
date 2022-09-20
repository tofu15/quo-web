<script setup>
import {reactive} from 'vue'
import router from '/router'
import {useQuasar} from 'quasar'

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

    const data = {newpwd: form.newpwd1}

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
            form.isLoading = false
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
                <q-form greedy @submit="postData" class="q-gutter-md">
                    <q-input outlined :type="form.isPwd ? 'password' : 'text'" v-model.trim="form.pwd" label="初期パスワード"
                             lazy-rules :rules="[
                          val => val && val.length > 0 || '初期パスワードを入力してください。',
                          val => val == '000000' || '初期パスワードが正しくありません。'
                        ]">
                        <template v-slot:append>
                            <q-icon :name="form.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                    @click="form.isPwd = !form.isPwd"/>
                        </template>
                    </q-input>

                    <q-input outlined :type="form.isPwd ? 'password' : 'text'" v-model.trim="form.newpwd1"
                             label="新パスワード" lazy-rules :rules="[
                        val => val && val.length > 0 || '新パスワードを入力してください。',
                        val => /^\w{8,16}$/.test(val) || '8〜16文字の半角英数字を入力してください。']">
                        <template v-slot:append>
                            <q-icon :name="form.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                    @click="form.isPwd = !form.isPwd"/>
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
                                    @click="form.isPwd = !form.isPwd"/>
                        </template>
                    </q-input>

                    <div>
                        <q-btn :loading="form.isLoading" label="変更" type="submit" color="primary"
                               style="width: 100%;"/>
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
    min-height: calc(100vh - 70px)
    display: flex
    align-items: center
    justify-content: center

    > div
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