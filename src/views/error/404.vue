<template lang='pug'>
  .basic-not-found
    .basic-container
      div(class="exception-content")
        img.imgException(src="https://img.alicdn.com/tfs/TB1txw7bNrI8KJjy0FpXXb5hVXa-260-260.png")
        div
          h3.title '抱歉，你访问的页面不存在'
          router-link(to="/")
            p.description '您要找的页面没有找到，请返回
              span.a 首页
              span 继续浏览'
</template>

<script>

export default {
  data () {
    return {
    }
  }
}

</script>

<style lang="stylus" scoped>
$container-height = 70vh;
.basic-container {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 6px;
    min-width: 721px
  }
.exception-content {
  display: flex;
  align-items: center;
  justify-content: center;
  .title {
    color: rgb(51, 51, 51);
  }
  .description {
    color: rgb(102, 102, 102);
  }
}

@media screen and (max-width: 1199px) and (min-width: 721px) {
  .exception-content {
    .imgException {
      max-width: 180px;
      margin-right: 30px;
    }
    .title {
      font-size: 20px;
      margin: 10px 0;
    }
    .description {
      font-size: 14px;
    }
  }
}
@media screen and (min-width: 1200px) {
  .exception-content {
    min-height: $container-height;

    .imgException {
      max-width: 260px;
      margin-right: 50px;
    }
    .title {
      font-size: 24px;
      margin: 20px 0;
    }
    .description {
      font-size: 16px;
    }
  }
}
</style>
