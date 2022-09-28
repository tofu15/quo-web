<script setup lang="ts">
import {reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {Post} from "@/script/api";
import {useQuasar} from 'quasar'

const emit = defineEmits(['loaded', 'reload'])
const $q = useQuasar()

const table = reactive({
    pwd: "",
    newpwd1: "",
    newpwd2: "",
    isPwd: true,
    loading: false
})

// header 参数
const headerProps = {
    title: 'パスワード変更',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 個人設定 / ',
            isUrl: false,
            url: ''
        },
        {
            text: 'パスワード変更',
            isUrl: false,
            url: ''
        }
    ]
}

// post 上传数据
function postData() {
    table.loading = true
    Post('/api/pwdreset', {pwd: table.pwd, newpwd: table.newpwd1}).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            table.loading = false
            Post('/api/logout').then((rsp) => {
                if (rsp instanceof Error) {
                    throw rsp
                } else if (!rsp.success) {
                    throw new Error(rsp.message)
                } else {
                    window.location.href = "/login"
                }
            }).catch((error) => {
                $q.dialog({
                    title: 'エラー',
                    message: error.toString(),
                    cancel: false,
                    persistent: false
                })
            })
        }
    }).catch((error) => {
        table.loading = false
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
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>

        <div class="formCon">
            <q-form greedy @submit="postData">
                <div class="inputCon">
                    <q-input no-error-icon outlined :type="table.isPwd ? 'password' : 'text'" v-model.trim="table.pwd"
                             label="旧パスワード"
                             lazy-rules :rules="[val => val && val.length > 0 || '旧パスワードを入力してください。']">
                        <template v-slot:append>
                            <q-icon :name="table.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                    @click="table.isPwd = !table.isPwd"/>
                        </template>
                    </q-input>

                    <q-input no-error-icon outlined :type="table.isPwd ? 'password' : 'text'"
                             v-model.trim="table.newpwd1"
                             label="新パスワード" lazy-rules :rules="[
                        val => val && val.length > 0 || '新パスワードを入力してください。',
                        val => /^\w{8,16}$/.test(val) || '8〜16文字の半角英数字を入力してください。']">
                        <template v-slot:append>
                            <q-icon :name="table.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                    @click="table.isPwd = !table.isPwd"/>
                        </template>
                    </q-input>

                    <q-input no-error-icon outlined :type="table.isPwd ? 'password' : 'text'"
                             v-model.trim="table.newpwd2"
                             label="新パスワード（確認入力）" lazy-rules :rules="[
                          val => val && val.length > 0 || '新パスワード（確認）を入力してください。',
                          val => /^\w{8,16}$/.test(val) || '8〜16文字の半角英数字を入力してください。',
                          val => val === table.newpwd1 || '新パスワードと再入力パスワードが一致しません。'
                        ]">
                        <template v-slot:append>
                            <q-icon :name="table.isPwd ? 'r_visibility_off' : 'r_visibility'" class="cursor-pointer"
                                    @click="table.isPwd = !table.isPwd"/>
                        </template>
                    </q-input>
                </div>


                <div class="con">
                    <q-btn :loading="table.loading" label="変更" type="submit" color="primary"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.formCon
    //max-width: 800px
    margin: 30px auto 0
    padding: 20px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

.inputCon
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    gap: 20px 80px
    padding: 20px 0

.input
    max-width: 400px
    // height: 80px
    // padding: 30px
    flex: 0 1 400px
// width: 400px
.input1
    padding-bottom: 20px

.con
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    gap: 20px 40px
    padding: 10px 0

.item
    flex: 0 0 100px
    width: 100px
    max-width: 100px
</style>
