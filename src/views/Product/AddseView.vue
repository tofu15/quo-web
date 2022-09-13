<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import {reactive, onBeforeMount, computed, ref} from 'vue';
import {onBeforeRouteLeave} from 'vue-router'
import router from '../../../router';
import {useQuasar} from 'quasar'

const $q = useQuasar()

// 获取信息
onBeforeMount(() => {
    // 获取类型信息
    fetch('/api/product-type-list-series-add').then((response) => {
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
            types.push({
                label: e.tname,
                value: Number(e.tid)
            })
        })
    }).catch((error) => console.error(error))
})
// header 参数
const headerProps = {
    title: '新規シリーズ',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 製品管理 / ',
            isUrl: false,
            url: ''
        },
        {
            text: '新規シリーズ',
            isUrl: false,
            url: ''
        }
    ]
}
// se 对象 绑定表单
const se = reactive({
    psname: "",
    tid: null,
    notes: ""
})
// 原始 se 对象
const initialSe = {
    psname: "",
    tid: null,
    notes: ""
}
// isLoading
const isLoading = ref(false)

// types 数组
const types = reactive([])

// 是否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (se.psname.length === 0 && se.tid === null && se.notes.length === 0) {
        return false
    } else {
        return true
    }
})

// modal 绑定
const modalData = reactive({
    url: '',
    auth: false
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
    const data = {
        psname: se.psname,
        tid: se.tid,
        notes: se.notes
    }
    isLoading.value = true
    fetch('/api/product-series', {
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
            router.push({name: 'product-listse'})
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
            <q-form greedy @reset="Object.assign(se, initialSe)" @submit="postData">
                <div class="row">
                    <q-input :rules="[val => !!val || '入力必須です。']" v-model.trim="se.psname" label="シリーズ名"
                             class="col-sm-12 col-md-6" outlined/>
                    <q-select :rules="[val => !!val || '入力必須です。']" v-model="se.tid" :options="types"
                              label="タイプ" class="col-sm-12 col-md-6" outlined emit-value map-options/>
                    <q-input
                        :rules="[val => !!val || '入力必須です。', val => val.length <=10 || '10文字まで。']"
                        label="付属"
                        class="col-sm-12 col-md-6"
                        v-model="se.notes"
                        no-error-icon
                        counter
                        autogrow
                        outlined
                        type="textarea"
                    />
                </div>
                <div>
                    <q-btn label="リセット" type="reset" color="secondary"/>
                    <q-btn :loading="isLoading" label="保存" type="submit" color="primary"
                           class="q-ml-sm"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.actionCon
    margin-bottom: 20px

    > button:not(:first-of-type):last-of-type
        margin-left: 10px

div.formCon
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

    div.row
        > *
            padding-right: 20px
            margin-bottom: 10px
</style>
