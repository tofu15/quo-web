<script setup>
import { reactive, ref } from 'vue'
import router from '/router';
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = reactive({
    eno: "",
    pwd: "",
    isPwd: true,
    flag: false,
    isLoading: false
})

function postData() {
    form.isLoading = true

    let data = {
        eno: form.eno,
        pwd: form.pwd,
        flag: form.flag ? "1" : "0"
    }

    fetch('/api/login', {
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
            if (json.code === 10001) {
                router.push('/resetpw')
            } else {
                router.push('/home')
            }
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
                <h1>ログイン</h1>
                <p>見積システムへようこそ</p>
                <q-form greedy @submit="postData" class="q-gutter-md">
                    <q-input outlined v-model.trim="form.eno" label="ユーザーID" lazy-rules
                        :rules="[ val => val && val.length > 0 || 'ユーザーIDは入力必須です。']" />

                    <q-input outlined :type="form.isPwd ? 'password' : 'text'" v-model.trim="form.pwd" label="パスワード"
                        lazy-rules :rules="[
                          val => val && val.length > 0 || 'パスワードは入力必須です。'
                        ]">
                        <template v-slot:append>
                            <q-icon :name="form.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                @click="form.isPwd = !form.isPwd" />
                        </template>
                    </q-input>

                    <q-toggle v-model="form.flag" label="次回から自動的にログイン" />

                    <div>
                        <q-btn :loading="form.isLoading" label="ログイン" type="submit" color="primary"
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