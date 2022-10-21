<script setup lang="ts">
import MainViewHeader from '@/components/Common/MainViewHeader.vue'
import type {Cus, CusPost} from "@/views/Customer/Interface";
import {computed, inject, reactive} from "vue";
import {onBeforeMount} from "@modules/vue";
import {Get, Put} from "@/script/api";
import {onBeforeRouteLeave, useRoute} from "@modules/vue-router";
import router from "@/router";
import {useQuasar} from "@modules/quasar";
import type {UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const route = useRoute()
const $q = useQuasar()
const emit = defineEmits(['loaded'])
// header 参数
const headerProps = {
    title: '顧客編集',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/home'
        },
        {
            text: ' / 顧客管理 / ',
            isUrl: false,
            url: ''
        },
        {
            text: '顧客一覧',
            isUrl: true,
            url: '/product/list'
        },
        {
            text: ' / 顧客編集',
            isUrl: false,
            url: ''
        }
    ]
}

const status = reactive({
    loading: false
})

const initialTable: Cus = reactive({
    cid: 0,
    cname: "",
    ctype: "",
    address: "",
    email: "",
    zip: "",
    tel: "",
    fax: "",
    contact: "",
    ename: "",
    csource: "",
    ftime: ""
})

const table: Cus = reactive({
    cid: 0,
    cname: "",
    ctype: "",
    address: "",
    email: "",
    zip: "",
    tel: "",
    fax: "",
    contact: "",
    ename: "",
    csource: "",
    ftime: ""
})

const isEdited = computed<boolean>(() => {
    return !(postData.value.cname == initialTable.cname
        && postData.value.address == initialTable.address
        && postData.value.email == initialTable.email
        && postData.value.zip == initialTable.zip
        && postData.value.tel == initialTable.tel
        && postData.value.fax == initialTable.fax
        && postData.value.contact == initialTable.contact
        && postData.value.csource == initialTable.csource
        && postData.value.ftime == initialTable.ftime
    )
})

const postData = computed(() => {
    let result: CusPost = {
        cname: table.cname,
        address: table.address,
        email: table.email,
        zip: table.zip,
        tel: table.tel,
        fax: table.fax,
        contact: table.contact,
        csource: table.csource,
        ftime: table.ftime
    }
    return result
})

// modal 绑定
const modalData = reactive({
    url: '',
    auth: false
})

function update() {
    status.loading = true
    Put((Permission.CustomerEditAll ? '/api/customer-all/' : '/api/customer-personal/') + route.params.id, postData.value).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            status.loading = false
            modalData.auth = true
            router.push({name: 'customer-list'})
        }
    }).catch((error) => {
        status.loading = false
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}

onBeforeRouteLeave((to) => {
    if (!isEdited.value || modalData.auth) {
        return true
    } else {
        modalData.url = to.path
        $q.dialog({
            title: '確認',
            message: 'この画面から離れます。入力中のデータは保存されません。よろしいですか？',
            cancel: true,
            persistent: false
        }).onOk(() => {
            modalData.auth = true
            router.push(modalData.url)
        })
        return false
    }
})

// 调用后端接口 获取信息 修改 table
onBeforeMount(async () => {
    await Get((Permission.CustomerViewAll ? '/api/customer-all/' : '/api/customer-personal/') + route.params.id).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Cus
        }
    }).then((data) => {
        Object.assign(table, data)
        Object.assign(initialTable, data)
    }).catch((error) => console.log(error))

    emit('loaded')
})

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>

        <div class="formCon">
            <div class="con">
                <q-btn class="item" label="戻る" color="grey" @click="$router.push({ name: 'customer-list'})"/>
            </div>
            <q-form greedy @reset="Object.assign(table, initialTable)" @submit="update">
                <div class="inputCon">
                    <q-input class="input readonly" readonly v-model="table.cid" label="顧客ID"
                             outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。']"
                             v-model.trim="table.cname" label="会社名" outlined/>
                    <q-input class="input readonly" readonly v-model="table.ctype" label="顧客タイプ"
                             outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。']"
                             v-model.trim="table.address" label="アドレス" outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。',val => val.length === 8 || '有効な郵便番号ではありません。']"
                             mask="###-####"
                             v-model.trim="table.zip" label="郵便番号" outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。',val => val.length === 12 || '有効な電話番号ではありません。']"
                             mask="###-###-####"
                             v-model.trim="table.tel" label="電話番号" outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。']"
                             v-model.trim="table.contact" label="担当者" outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。', val => emailRegex.test(val) || '有効なメールアドレスではありません。']"
                             v-model.trim="table.email" label="メールアドレス" outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。',val => val.length === 12 || '有効なファックス番号ではありません。']"
                             mask="###-###-####"
                             v-model.trim="table.fax" label="ファックス" outlined/>
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。']"
                             v-model.trim="table.csource" label="ソース" outlined/>
                    <q-input class="input readonly" readonly v-model="table.ename" label="作成者"
                             outlined/>
                    <q-input class="input" label="フォロー日付" outlined v-model="table.ftime" mask="date"
                             :rules="[ (val, rules) => rules.date(val) || '正しくありません' ]">
                        <template v-slot:append>
                            <q-icon name="r_event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date today-btn v-model="table.ftime">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat/>
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="con">
                    <q-btn class="item" label="リセット" type="reset" color="secondary"/>
                    <q-btn class="item" :disable="!isEdited" :loading="status.loading" label="保存" type="submit"
                           color="primary"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style scoped lang="sass">
.formCon
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
    flex: 0 1 400px

.input.readonly
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