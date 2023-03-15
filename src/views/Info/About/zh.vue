<template>
  <div class="about-container">
    <div class="about-title">
      关于本站
    </div>
    <div class="about-body">
      <p><span style="font-weight: bold">滇史论辑</span>是致力于搜集云南历史论文的网站，其核心是多阶级分类系统，兼有用户系统、上传/审批系统共三大模块。本站侧重于对信息的分类与整理，首要功能是按主题提供论文清单，方便用户更加全面的了解学界对该主题所进行的研究。此外，本站开放“公有领域”版权的论文下载。</p>
      <p>我是一名热爱云南历史的计算机科学本科生，这个网站是我的毕业设计。念大二时就有做这个系统的打算，因疫情在家宅了一年，系统性的搜集了中国知网上的云南历史论文，数量已超过八千篇。这个规模的资料整理起来是个不小的困难，计算机文件夹只能“单分类”的特点难以胜任对论文分类精细化的要求。另一方面，商业论文网站的搜索与标签系统很多时候并不尽如人意，即使同属一个主题，关键词不同时仍然无法轻易找全相关论文。再者，商业论文网站只提供了在线出版的论文，大量没有在线出版以及老旧论文不在商业论文网站的收录范围。本站的用户上传功能允许用户上传系统未收录的论文，将以“共同建设”的理念完善云南历史论文的搜集与整理。</p>
      <p>到目前为止这个网站还没有全部完成，由于学校只给了毕设两个月的开发与论文时间，还有一些功能没有完成，比如：按期刊分类、用户收藏等。当前版本只是测试版，用于提交毕业设计。正式版会在完成更多功能的开发，以及内容建设完善后上线。</p>
      <p>联系方式：<a :href="'mailto:' + email">{{ this.email }}</a></p>
    </div>
  </div>
</template>

<script>
import {getContactEmail} from "@/utils/general";

export default {
  data() {
    return {
      email: getContactEmail()
    }
  }
}
</script>

<style lang="less" scoped>
.about-container {
  margin: 20px 10% 50px;
}
.about-title {
  text-align: center;
  line-height: 100px;
  font-size: 2em;
  font-weight: bold;
}
.about-body {
  font-size: 1.3em;
  line-height: 30px;
  p {
    margin-bottom: 20px;
  }
}
a {
  text-decoration: none;
}
a:link {
  color: #0645AD;
}
a:visited {
  color: #0645AD;
}
a:hover {
  color: dodgerblue;
}
a:active {
  color: darkorange;
}
</style>