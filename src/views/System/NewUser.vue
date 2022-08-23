<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '/router';

// 获取部门和职位信息
const depts = reactive([])
const roles = reactive([])
const rolesOfDept = computed(() => {
    return roles.filter(role => String(role.dno) == form.dno)
})

onBeforeMount(async () => {
    let deptsJson = await (await fetch('/api/dept')).json()
    deptsJson.forEach(element => {
        depts.push(element)
    })
    let rolesJson = await (await fetch('/api/role')).json()
    rolesJson.forEach(element => {
        roles.push(element)
    })
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
// modal 参数
const modalProps = reactive({
    title: "",
    text: "",
    type: 0
})
// modal 绑定
const modalData = reactive({
    show: false,
    url: ''
})

function modalEvent(result) {
    if (modalProps.type == 2) {
        if (result) {
            router.push(modalData.url)
        } else {
            modalData.show = false
        }
    } else {
        modalData.show = false
    }
}

onBeforeRouteLeave((to, from) => {
    if (form.name === "" && form.dno === "" && form.rid === "" && form.email === "" && form.tel === "") {
        return true
    } else {
        if (modalData.show) {
            return true
        } else {
            modalProps.title = "確認"
            modalProps.text = "この画面から離れます。入力中のデータは保存されません。<br>よろしいですか？"
            modalProps.type = 2
            modalData.show = true
            modalData.url = to.path
            return false
        }
    }
})


// 表单动态绑定
const form = reactive({
    name: '',
    dno: '',
    rid: '',
    email: '',
    tel: '',
    isLoading: false
})
// 异常动态绑定
const isError = reactive({
    name: {
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
    } else if (form.name.length > 12) {
        isError.name.isErr = true
        isError.name.errMsg = "長すぎます。"
    } else {
        isError.name.isErr = false
        isError.name.errMsg = ""
    }
}

// email 更新处理
function emailUpdated() {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (form.email.length == 0) {
        isError.email.isErr = ""
        isError.email.errMsg = ""
    } else if (!regex.test(form.email)) {
        isError.email.isErr = true
        isError.email.errMsg = "有効なメールアドレスではありません。"
    } else {
        isError.email.isErr = false
        isError.email.errMsg = ""
    }
}
// tel 更新处理
function telUpdated() {
    const regex = /^0[5789]0-[0-9]{4}-[0-9]{4}$/;
    if (form.tel.length == 0) {
        isError.tel.isErr = ""
        isError.tel.errMsg = ""
    } else if (!regex.test(form.tel)) {
        isError.tel.isErr = true
        isError.tel.errMsg = "有効な携帯番号ではありません。"
    } else {
        isError.tel.isErr = false
        isError.tel.errMsg = ""
    }
}


// post 上传数据
async function postData() {
    form.isLoading = true
    const data = {
        ename: form.name.trim(),
        dno: Number(form.dno),
        rid: Number(form.rid),
        tel: form.tel,
        email: form.email
    }
    let response = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        let json = await response.json();
        form.isLoading = false
        if (json.success) {
            router.push('/system/user')
        } else {
            modalProps.title = "エラー"
            modalProps.text = json.errorMsg
            modalData.show = true
        }
    } else {
        form.isLoading = false
        modalProps.title = "エラー"
        modalProps.text = "エラーが発生しました。"
        modalData.show = true
    }
}

</script>

<template>
    <div>
        <CommonModal v-if="modalData.show" v-bind="modalProps" @modalEvent="modalEvent">
        </CommonModal>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <form>
            <label>氏名（12文字以内）<span class="redText">*</span></label>
            <input :aria-invalid="isError.name.isErr" @input="nameUpdated" @focusout="nameUpdated" v-model="form.name"
                type="text">
            <small v-if="!isError.name.errMsg.length == 0">{{ isError.name.errMsg }}</small>
            <label>部署<span class="redText">*</span></label>
            <select @change="form.rid = ''" v-model="form.dno">
                <option disabled value="" selected="">選択してください</option>
                <option v-for="dept in depts" :value="Number(dept.dno)">{{ dept.dname }}</option>
            </select>
            <label>職位<span class="redText">*</span></label>
            <select v-model="form.rid">
                <option disabled value="" selected="">選択してください</option>
                <option v-for="role in rolesOfDept" :value="Number(role.rid)">{{ role.rname }}</option>
            </select>
            <label>email</label>
            <input :aria-invalid="isError.email.isErr" @input="emailUpdated" @focusout="emailUpdated"
                v-model="form.email" type="text">
            <small v-if="!isError.email.errMsg.length == 0">{{ isError.email.errMsg }}</small>
            <label>携帯電話</label>
            <input :aria-invalid="isError.tel.isErr" @input="telUpdated" @focusout="telUpdated" v-model="form.tel"
                type="text">
            <small v-if="!isError.tel.errMsg.length == 0">{{ isError.tel.errMsg }}</small>
            <button @click="postData" :aria-busy="form.isLoading"
                :disabled="isError.name.isErr === true || form.dno.length == 0 || form.rid.length == 0 || isError.email.isErr === true || isError.tel.isErr === true"
                type="button">確認</button>
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
    small
            font-weight: 500
            color: red
</style>
