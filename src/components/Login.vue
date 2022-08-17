<script setup>
import { reactive, ref } from 'vue'
const form = reactive({
    eno: "",
    pwd: "",
    flag: false
})
const isEnoEmpty = ref("")
const isPwdEmpty = ref("")
const isLoading = ref(false)
const errorMsg = ref("")

let flagdata = 0
if (form.flag) {
    flagdata = "1"
} else {
    flagdata = "0"
}
async function postData() {
    isLoading.value = true

    const formData = new FormData()
    formData.append('eno', form.eno)
    formData.append('pwd', form.pwd)
    formData.append('flag', flagdata)

    let response = await fetch('/login.do', {
        method: 'POST',
        body: formData,
    }).then((response) => {
        if (!response.ok) {
            isLoading.value = false
            errorMsg.value = "エラーが発生しました。"
        }
    })

    if (response.ok) {
        let json = await response.json();
        isLoading.value = false
        if (json.success) {
            window.location.href = "/";
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
                    <input :aria-invalid="isEnoEmpty" @focusout="isEnoEmpty = form.eno.length == 0"
                        @input="isEnoEmpty = form.eno.length == 0" v-model.trim="form.eno" type="text" id="eno"
                        name="eno">
                    <small v-if="isEnoEmpty">ユーザーIDは入力必須です。</small>
                    <label for="pwd">パスワード</label>
                    <input :aria-invalid="isPwdEmpty" @focusout="isPwdEmpty = form.pwd.length == 0"
                        @input="isPwdEmpty = form.pwd.length == 0" v-model.trim="form.pwd" type="password" id="pwd"
                        name="pwd">
                    <small v-if="isPwdEmpty">パスワードは入力必須です。</small>
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
</style>