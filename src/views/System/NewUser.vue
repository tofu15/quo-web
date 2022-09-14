<script setup>
import {reactive, computed, onBeforeMount, watch} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import router from '/router';
import {useQuasar} from 'quasar'

const $q = useQuasar()

// 获取部门和职位信息
const depts = reactive([])
const roles = reactive([])
const rolesOfDept = computed(() => {
    return roles.filter(role => role.dno === form.dno)
})

onBeforeMount(() => {
    // 获取部门信息
    fetch('/api/dept').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            return json.data
        } else {
            throw new Error(json.message);
        }
    }).then((data) => {
        data.forEach(e => {
            depts.push({
                label: e.dname,
                value: e.dno
            })
        })
    }).catch((error) => console.error(error))

    // 获取职位信息
    fetch('/api/role').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            return json.data
        } else {
            throw new Error(json.message);
        }
    }).then((data) => {
        data.forEach(e => {
            roles.push({
                label: e.rname,
                value: e.rid,
                dno: e.dno
            })
        })
    }).catch((error) => console.error(error))
})

// header 参数
const headerProps = {
    title: '新規ユーザー',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / システム設定',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 新規ユーザー',
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
    if (form.name.length === 0 && form.dno === null && form.rid === null && form.email.length === 0 && form.tel.length === 0) {
        return false
    } else {
        return true
    }
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

// 表单动态绑定
const form = reactive({
    name: '',
    dno: null,
    rid: null,
    email: '',
    tel: '',
    isLoading: false
})
// 初始表单
const initialForm = reactive({
    name: '',
    dno: null,
    rid: null,
    email: '',
    tel: '',
    isLoading: false
})

// 观察 dno 变化时 重置 rid
watch(() => form.dno, (dno, olddno) => {
    if (olddno !== null) {
        form.rid = null
    }
})

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const telRegex = /^0[5789]0-[0-9]{4}-[0-9]{4}$/


// post 上传数据
function postData() {
    form.isLoading = true
    const data = {
        ename: form.name,
        dno: form.dno,
        rid: form.rid,
        tel: form.tel,
        email: form.email
    }
    fetch('/api/user', {
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
            modalData.auth = true
            router.push('/system/user')
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
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="formCon">
            <q-form greedy @reset="Object.assign(form, initialForm)" @submit="postData">
                <div>
                    <q-input :rules="[val => !!val || '入力必須です。', val => val.length <= 12 || '12文字まで。']"
                             v-model.trim="form.name"
                             label="氏名"
                             outlined/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="form.dno" :options="depts"
                              label="部署" outlined emit-value map-options/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="form.rid" :options="rolesOfDept"
                              label="職位" outlined emit-value map-options/>
                    <q-input
                        :rules="[val => !val || emailRegex.test(val) || '有効なメールアドレスではありません。']"
                        v-model.trim="form.email" label="email"
                        outlined/>
                    <q-input
                        :rules="[val => !val || telRegex.test(val) || '有効な携帯番号ではありません。']"
                        v-model.trim="form.tel" label="携帯電話"
                        outlined/>
                </div>
                <div>
                    <q-btn label="リセット" type="reset" color="secondary"/>
                    <q-btn :loading="form.isLoading" label="保存" type="submit" color="primary"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.formCon
    //max-width: 800px
    margin: 50px auto 0
    padding: 40px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff
</style>
