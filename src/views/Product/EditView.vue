<script setup>
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import { reactive, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute()
// header 参数
const headerProps = {
    title: '製品情報編集',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/home'
        },
        {
            text: ' / 製品管理 / ',
            isUrl: false,
            url: ''
        },
        {
            text: '製品一覧',
            isUrl: true,
            url: '/product/list'
        },
        {
            text: ' / 製品情報編集',
            isUrl: false,
            url: ''
        }
    ]
}
</script>
            
<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="formCon">
            <div>
                <label>製品ID</label>
                <input type="text">
                <small></small>
            </div>
            <div>
                <label>名称</label>
                <input type="text">
                <small></small>
            </div>
            <div>
                <label>単価（円）</label>
                <input type="number">
                <small></small>
            </div>
            <div>
                <label>タイプ</label>
                <select></select>
            </div>
            <div>
                <label>シリーズ</label>
                <select></select>
            </div>
            <div>
                <label>接続性</label>
                <input type="text">
                <small></small>
            </div>
            <div>
                <label>インターフェイス</label>
                <label><input name="interface" type="radio">あり</label>
                <label><input name="interface" type="radio">なし</label>
            </div>
            <div>
                <label>重低音</label>
                <label><input name="bass" type="radio">あり</label>
                <label><input name="bass" type="radio">なし</label>
            </div>
            <div>
                <label>防水</label>
                <input type="text">
                <small></small>
            </div>
            <div>
                <label>マイク通話</label>
                <label><input name="mic" type="radio">あり</label>
                <label><input name="mic" type="radio">なし</label>
            </div>
            <div>
                <label>付属</label>
                <textarea cols="30" rows="10"></textarea>
                <small></small>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.formCon
    display: flex
    flex-wrap: wrap
    >div
        padding-right: 30px
        min-width: 50%
</style>
