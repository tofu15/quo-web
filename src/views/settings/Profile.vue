<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import router from '../../router'
import {Get, Put} from "@/script/api";
import {useQuasar} from 'quasar'

const emit = defineEmits(['loaded', 'reload'])
const $q = useQuasar()

// 定义 接口
interface Profile {
    eno: null | number
    ename: string
    dname: string
    rname: string
    tel: null | string
    email: null | string
}

interface ProfileData {
    tel: null | string
    email: null | string
}

const tableRaw: Profile = reactive({
    eno: null,
    ename: "",
    dname: "",
    rname: "",
    tel: null,
    email: null
})

const tableData = computed<ProfileData>(() => {
    return {
        tel: tableRaw.tel,
        email: tableRaw.email
    }
})

const initialTableData: ProfileData = reactive({
    tel: null,
    email: null
})

const loading = ref(false)

// 获取用户信息
onBeforeMount(async () => {
    // 获取部门信息
    await Get('/api/person').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Profile
        }
    }).then((data) => {
        Object.assign(tableRaw, data)
        initialTableData.tel = data.tel
        initialTableData.email = data.email
    }).catch((error) => console.log(error))

    emit('loaded')
})

// header 参数
const headerProps = {
    title: '個人情報',
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
            text: '個人情報',
            isUrl: false,
            url: ''
        }
    ]
}

// modal 绑定
const modalData = reactive({
    url: '',
    auth: false
})

const isAnyEdit = computed(() => {
    return !(initialTableData.tel == tableData.value.tel && initialTableData.email == tableData.value.email);
})

onBeforeRouteLeave((to) => {
    if (!isAnyEdit.value || modalData.auth) {
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

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const telRegex = /^0[5789]0-[0-9]{4}-[0-9]{4}$/


// post 上传数据
function postData() {
    loading.value = true
    Put('/api/person', tableData.value).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            loading.value = false
            emit('reload')
        }
    }).catch((error) => {
        loading.value = false
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}

function postCheck() {
    $q.dialog({
        title: '確認',
        message: '個人情報を更新します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        postData()
    })
}

</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>

        <div class="formCon">
            <q-form greedy @reset="tableRaw.email = initialTableData.email;tableRaw.tel = initialTableData.tel"
                    @submit="postCheck">
                <div class="inputCon">
                    <q-input class="input input1" readonly v-model="tableRaw.eno" label="社員番号"
                             outlined/>
                    <q-input class="input input1" readonly v-model="tableRaw.ename" label="氏名" outlined/>
                    <q-input class="input input1" readonly v-model="tableRaw.dname" label="部署" outlined/>
                    <q-input class="input input1" readonly v-model="tableRaw.rname" label="職位" outlined/>
                    <q-input class="input" :rules="[val => !val || emailRegex.test(val) || '有効なメールアドレスではありません。']"
                             v-model.trim="tableRaw.email" label="email" outlined/>
                    <q-input class="input" :rules="[val => !val || telRegex.test(val) || '有効な携帯番号ではありません。']"
                             v-model.trim="tableRaw.tel" label="携帯電話" outlined/>
                </div>
                <div class="con">
                    <q-btn class="item" label="リセット" type="reset" color="secondary"/>
                    <q-btn class="item" :loading="loading" :disable="!isAnyEdit" label="保存" type="submit"
                           color="primary"/>
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
