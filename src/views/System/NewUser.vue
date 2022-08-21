<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
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

</script>

<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <form>
            <label>氏名<span class="redText">*</span></label>
            <input type="text">
            <label>部署<span class="redText">*</span></label>
            <select>
                <option disabled value="" selected="">選択してください</option>
                <option>製品部</option>
                <option>倉庫部</option>
                <option>営業部</option>
            </select>
            <label>職位<span class="redText">*</span></label>
            <select>
                <option disabled value="" selected="">選択してください</option>
                <option>部長</option>
                <option>課長</option>
                <option>営業員</option>
            </select>
            <label>email</label>
            <input type="text">
            <label>電話番号</label>
            <input type="text">
            <input type="button" value="確認">
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
