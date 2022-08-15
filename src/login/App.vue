<script setup>
</script>

<template>
    <header>
        <a href="/"><img src="/images/logo.png" alt="logo"></a>

    </header>
    <main>
        <div>
            <h1>ログイン</h1>
            <p>見積システムへようこそ</p>
            <form action="" method="post">
                <label for="pid">ユーザーID</label>
                <input type="text" id="pid" name="pid">
                <label for="pw">パスワード</label>
                <input type="password" id="pw" name="pw">
                <label for="isremembered">
                    <input type="checkbox" id="isremembered" name="isremembered" role="switch">
                    次回から自動的にログイン
                </label>
                <button type="submit">ログイン</button>
            </form>

        </div>
    </main>
</template>

<style lang="sass">
#app
    --font-size: 16px
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
        
        h1
            font-size: 1.7rem
            margin-bottom: 0
        
        button
            margin-top: 20px
</style>
