<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import { reactive, onBeforeMount, computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '../../../router';

// 获取产品信息 和 系列类型信息
onBeforeMount(async () => {
    // 获取数据
    const typeJson = await (await fetch('/api/product-type-list')).json()
    const typeData = typeJson.data

    // types 赋值
    typeData.forEach(e => {
        types.push(e)
    });
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

// types 数组
const types = reactive([])

// 是否做了任何编辑修改
const isAnyEdit = computed(() => {
    if (se.psname.length == 0 && se.tid === null && se.notes.length == 0) {
        return false
    } else {
        return true
    }
})
// 是否能够保存
const isSaveAble = computed(() => {
    if (!isAnyEdit.value) {
        return false
    } else if (se.psname.length == 0 || se.tid == null || se.notes.length == 0) {
        return false
    } else {
        return true
    }
})

// modal 参数
const modalProps = reactive({
    title: "確認",
    text: "この画面から離れます。入力中のデータは保存されません。<br>よろしいですか？",
    type: 2
})
// modal 绑定
const modalData = reactive({
    show: false,
    url: '',
    auth: false
})

onBeforeRouteLeave((to, from) => {
    if (!isAnyEdit.value || modalData.show || modalData.auth) {
        return true
    } else {
        modalData.show = true
        modalData.url = to.path
        return false
    }
})

function modalEvent(result) {
    if (result) {
        router.push(modalData.url)
    } else {
        modalData.show = false
    }
}

// 上传数据
// post 上传数据
async function postData() {
    const data = {
        psname: se.psname,
        tid: se.tid,
        notes: se.notes
    }
    let response = await fetch('/api/product-series', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        let json = await response.json();
        if (json.success) {
            modalData.auth = true
            router.push({ name: 'product-listse' })
        }
    }
}
</script>
            
<template>
    <div>
        <CommonModal v-if="modalData.show" v-bind="modalProps" @modalEvent="modalEvent">
        </CommonModal>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="btnCon">
            <button @click="postData" :disabled="!isSaveAble">保存</button>
        </div>
        <div class="formCon">
            <div>
                <label>シリーズ名</label>
                <input :aria-invalid="se.psname.length == 0 ? true : ''" v-model.trim="se.psname" type="text">
                <small v-if="se.psname.length == 0">入力必須です。</small>
            </div>
            <div>
                <label>タイプ</label>
                <select v-model.trim="se.tid">
                    <option v-for="t in types" :value="t.tid">{{ t.tname }}</option>
                </select>
            </div>
            <div>
                <label>備考</label>
                <textarea :aria-invalid="se.notes.length == 0 ? true : ''" v-model.trim="se.notes" maxlength="10"
                    cols="10" rows="5"></textarea>
                <small v-if="se.notes.length == 0">入力必須です。</small>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.btnCon
    >button
        width: auto
        display: inline-block
        &:last-of-type
            margin-left: 10px
div.formCon
    display: flex
    flex-wrap: wrap
    padding: 50px
    border-radius: 10px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff
    >div
        padding-right: 30px
        min-width: 50%
        >label
            &:first-child
                font-weight: 500
            &:last-child
                margin-bottom: 16px
small
    color: red
</style>
