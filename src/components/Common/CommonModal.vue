<script setup>

const props = defineProps({
    title: String,
    text: String,
    type: Number
})
</script>

<template>
    <div class="modal-overlay" @click.self="$emit('modalEvent', false)">
        <div class="modal">
            <div class="close" @click="$emit('modalEvent', false)"></div>
            <h3>{{ props.title }}</h3>
            <p v-html="props.text"></p>
            <div class="footer">
                <button @click="$emit('modalEvent', false)" v-if="props.type == 2" class="secondary">キャンセル</button>
                <button @click="$emit('modalEvent', true)">OK</button>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.modal-overlay
    display: flex
    z-index: 999
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    align-items: center
    justify-content: center
    width: inherit
    min-width: 100%
    height: inherit
    min-height: 100%
    padding: 20px
    border: 0
    background-color: rgba(213, 220, 226, 0.8)
    
    div.modal
        margin: 60px 0
        padding: 60px 30px
        border-radius: var(--border-radius)
        background: #fff
        box-shadow: 0.0145rem 0.029rem 0.174rem rgba(27, 40, 50, 0.01698),0.0335rem 0.067rem 0.402rem rgba(27, 40, 50, 0.024),0.0625rem 0.125rem 0.75rem rgba(27, 40, 50, 0.03),0.1125rem 0.225rem 1.35rem rgba(27, 40, 50, 0.036),0.2085rem 0.417rem 2.502rem rgba(27, 40, 50, 0.04302),0.5rem 1rem 6rem rgba(27, 40, 50, 0.06),0 0 0 0.0625rem rgba(27, 40, 50, 0.015)
        min-width: 400px
        @media (min-width: 576px)
            max-width: 510px
        @media (min-width: 768px)
            max-width: 700px
        // p
        //     text-align: center
        div.close
            cursor: pointer
            background: none
            background-position: center
            background-size: auto 20px
            background-repeat: no-repeat
            border: none
            width: 20px
            height: 20px
            background-image: var(--icon-close)
            margin: -30px 0 10px auto
        div.footer
            text-align: right
            padding: 30px
            margin: 60px -30px -60px -30px
            border-top: var(--border-width) solid hsl(205deg, 20%, 94%)
            border-bottom-right-radius: var(--border-radius)
            border-bottom-left-radius: var(--border-radius)
            background-color: #fbfbfc
            text-align: center
            button
                font-weight: 500
                display: inline-block
                margin-bottom: 0
                width: auto
                &:not(:first-of-type)
                    margin-left: 10px
                    
</style>
