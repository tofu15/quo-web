<script setup></script>

<template>
    <div class="app">
        <header>
            <a href="/"><img src="/images/logo.png" alt="logo"></a>

        </header>
        <main>
            <div>
                <p class="error"></p>
                <h1>初期パスワード変更</h1>
                <p>パスワードを変更してください</p>
                <form name="resetpw" action="/resetpw" method="post" onsubmit="return validateForm()">
                    <label for="pwd">初期パスワード</label>
                    <input type="password" id="pwd" name="pwd">
                    <small></small>
                    <label for="newpwd1">新パスワード</label>
                    <input type="password" id="newpwd1" name="newpwd1" placeholder="8〜16文字の半角英数字">
                    <small>8〜16文字の半角英数字を入力してください。</small>
                    <label for="newpwd2">新パスワード（確認入力）</label>
                    <input type="password" id="newpwd2" name="newpwd2" placeholder="8〜16文字の半角英数字">
                    <small></small>
                    <button type="submit">変更</button>
                </form>

            </div>
        </main>
    </div>
</template>

<style lang="sass" scoped>
div.app
    background-repeat: no-repeat
    background-size: cover
    background-position: top
    background-image: url(/images/login-background.jpg)

header
    padding: 20px 40px
    img
        height: 26px
    a:hover
        opacity: 0.7
        transition: opacity var(--transition)

main
    min-height: calc( 100vh - 70px )
    display: flex
    align-items: center
    justify-content: center
    >div
        min-width: 480px
        padding: 50px 50px 20px
        border-radius: 15px
        box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
        background-color: #fff

        p.error
            display: none
            color: red

        h1
            margin-bottom: 0

        button
            margin-top: 20px

        small
            font-weight: 500
            color: red
            display: none
        input[aria-invalid="true"] + small
            display: block

</style>