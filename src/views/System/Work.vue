<script setup>
import {reactive, computed, onBeforeMount, ref} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import router from '/router';
import {useQuasar} from 'quasar'

const $q = useQuasar()
// header 参数
const headerProps = {
    title: '業務設定',
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
            text: ' / 業務設定',
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

// 定义业务信息
const workData = reactive({
    amountCheck: 0,
    expiry: 0
})
const isLoading = ref(false)
// 定义初始业务信息
const initialWorkData = {
    amountCheck: 0,
    expiry: 0
}
// 从后台获取数据
onBeforeMount(() => {
    fetch('/api/system-setting').then((response) => {
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
        Object.assign(workData, data)
        Object.assign(initialWorkData, data)
    }).catch((error) => console.error(error))
})

// 是否做了任何编辑
const isAnyEdit = computed(() => {
    if (workData.amountCheck === initialWorkData.amountCheck && workData.expiry === initialWorkData.expiry) {
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

// 上传数据
function postData() {
    isLoading.value = true
    const data = {
        amountCheck: workData.amountCheck,
        expiry: workData.expiry
    }
    fetch('/api/system-setting', {
        method: 'PUT',
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
            router.go()
        } else {
            throw new Error(json.message);
        }
    }).catch((error) => {
        isLoading.value = false
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
            <q-form greedy @reset="Object.assign(workData, initialWorkData)" @submit="postData">
                <div class="inputCon">
                    <q-input
                        :rules="[val => !!val || '入力必須です。', val => val > 0 || '正しくありません。']"
                        v-model.number="workData.amountCheck" label="承認金額（円）" type="number" outlined/>
                    <q-input
                        :rules="[val => !!val || '入力必須です。', val => val > 0 || '正しくありません。']"
                        v-model.number="workData.expiry" label="見積有効期限（日）" type="number" outlined/>
                </div>
                <div class="con">
                    <q-btn class="item" label="リセット" type="reset" color="secondary"/>
                    <q-btn class="item" :disable="!isAnyEdit" :loading="isLoading" label="保存" type="submit"
                           color="primary"/>
                </div>
            </q-form>
        </div>
    </div>
</template>
<style lang="sass" scoped>
form
    max-width: 800px
    margin: 50px auto 0
    padding: 40px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

    label
        font-weight: 500

        .redText
            color: red

    small
        font-weight: 500
        color: red
</style>