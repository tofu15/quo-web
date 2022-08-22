<script setup>
import { reactive, ref } from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
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
// 表单动态绑定
const form = reactive({
    name: '',
    dno: '',
    rid: '',
    email: '',
    tel: '',
    isLoading: false,
    errorMsg: ''
})
// 异常动态绑定
const isError = reactive({
    name: {
        isErr: "",
        errMsg: ""
    },
    dno: {
        isErr: "",
        errMsg: ""
    },
    rid: {
        isErr: "",
        errMsg: ""
    },
    email: {
        isErr: "",
        errMsg: ""
    },
    tel: {
        isErr: "",
        errMsg: ""
    }
})

// name 更新处理
function nameUpdated() {
    if (form.name.length == 0) {
        isError.name.isErr = true
        isError.name.errMsg = "氏名を入力してください。"
    } else {
        isError.name.isErr = ""
        isError.name.errMsg = ""
    }
}

</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <form>
            <label>氏名<span class="redText">*</span></label>
            <input v-model="form.name" type="text">
            <label>部署<span class="redText">*</span></label>
            <select v-model="form.dno">
                <option disabled value="" selected="">選択してください</option>
                <option value="102">製品部</option>
                <option value="103">倉庫部</option>
                <option value="101">営業部</option>
            </select>
            <label>職位<span class="redText">*</span></label>
            <select v-model="form.rid">
                <option disabled value="" selected="">選択してください</option>
                <option value="1001">部長</option>
                <option value="1002">課長</option>
                <option value="1003">営業員</option>
            </select>
            <label>email</label>
            <input v-model="form.email" type="text">
            <label>電話番号</label>
            <input v-model="form.tel" type="text">
            <button :aria-busy="form.isLoading" type="button">確認</button>
        </form>
    </div>
</template>

<style lang="sass" scoped>
form
    max-width: 800px
    margin: 50px auto 0
    padding: 40px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    background-color: #fff
    label
        font-weight: 500
        .redText
            color: red
</style>
