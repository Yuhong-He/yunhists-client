<template>
  <div class="privacy-container">
    <div class="privacy-title">
      隐私政策
    </div>
    <div class="privacy-body">
      <p style="margin-bottom: 20px;">滇史论辑（下称“我们”、“我们”或“我们的”）运营网站 yunnanhistory.com（下称“网站”）。此页面告知您我们关于收集、使用和披露我们从网站用户那里收集到的个人信息的政策。</p>
      <ol class="privacy-list">
        <li>
          <p class="bold-text">信息收集和使用</p>
          <p>我们从注册我们服务的用户那里收集个人信息，包括他们的姓名和电子邮件地址。我们使用此信息为您提供服务，并就您的帐户与您沟通。</p>
        </li>
        <li>
          <p class="bold-text">数据存储和传输</p>
          <p>您的个人信息将在香港存储和处理。使用本网站即表示您同意将您的个人信息传输至香港。</p>
        </li>
        <li>
          <p class="bold-text">信息共享与披露</p>
          <p>我们不会出售、交易或以其他方式将您的个人信息转让给外部各方。但在以下情况下，我们可能会披露您的个人信息：</p>
          <ul class="privacy-inner-list">
            <li>为了遵守适用的法律或法规</li>
            <li>保护网站、我们的用户或其他人的权利、财产或安全</li>
          </ul>
        </li>
        <li>
          <p class="bold-text">数据安全</p>
          <p>我们采取合理措施保护您的个人信息免遭未经授权的访问、使用或披露。但是，请注意，没有一种通过网络传输信息或存储信息的方法是绝对安全的。</p>
        </li>
        <li>
          <p class="bold-text">Cookies</p>
          <p>我们使用 cookie 来改善您在我们网站上的体验。如果您不想接受 cookie，您可以选择在浏览器设置中禁用它们。</p>
        </li>
        <li>
          <p class="bold-text">儿童隐私</p>
          <p>我们的网站不适用于 16 岁以下的儿童，我们不会有意收集 16 岁以下任何人的个人信息。如果我们知道我们收集了 16 岁以下儿童的个人信息，我们将删除该信息。</p>
        </li>
        <li>
          <p class="bold-text">删除个人数据的权利</p>
          <p>您有权删除我们从您那里收集的任何个人信息。如果您想行使该权利，请在您的<span class="fake-link" @click="$router.push('/profile/UserInfo')">用户页面</span>上进行。请注意，我们可能需要保留某些信息以用于记录保存或完成您在请求删除之前发起的贡献。</p>
        </li>
        <li>
          <p class="bold-text">符合香港PDPO、中国PIPL和欧盟GDPR</p>
          <p>我们遵守香港《个人资料（私隐）条例 》（PDPO）、《中华人民共和国个人信息保护法》（PIPL）和欧盟《通用数据保护条例》（GDPR）。这意味着我们将：</p>
          <ul class="privacy-inner-list">
            <li>仅收集目的所必需的个人信息；</li>
            <li>在收集、使用或披露您的个人信息之前征得您的同意，法律允许的特定情况除外；</li>
            <li>采取合理措施确保我们收集的个人信息准确、完整和最新；</li>
            <li>仅将个人信息用于收集目的或与这些目的直接相关的目的，除非我们已获得您的同意或法律要求或允许将其用于其他目的；</li>
            <li>仅在实现收集信息的目的所需或法律要求的期限内保留个人信息；</li>
            <li>实施适当的技术和组织措施，以保护个人信息免遭未经授权或意外访问、处理、删除、丢失或使用；</li>
            <li>在法律允许的情况下，为您提供访问您的个人信息的权限，并允许您根据要求更正、更新或删除您的个人信息；</li>
            <li>如果您位于欧盟并希望行使您在 GDPR 下的权利，包括访问、纠正、删除、限制处理、数据可移植性和反对处理的权利，请通过<a :href="'mailto:' + email">{{ this.email }}</a>与我们联系。我们将尽快回复您的询问。</li>
          </ul>
        </li>
      </ol>
      <p style="margin-top: 20px;">如果您对本隐私政策有任何疑问，请通过<a :href="'mailto:' + email">{{ this.email }}</a>与我们联系。</p>
      <p style="margin-top: 20px;">中英文版隐私政策出现差异时，以英文版为准。</p>
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
.privacy-container {
  margin: 20px 10% 50px;
}
.privacy-title {
  text-align: center;
  line-height: 100px;
  font-size: 2em;
  font-weight: bold;
}
.privacy-body {
  font-size: 1.3em;
  line-height: 30px;
}
ol {
  list-style-type: decimal;
}
ul {
  list-style-type: circle;
}
.privacy-list {
  padding-left: 5%;
  padding-right: 5%;
}
.privacy-inner-list {
  padding-left: 5%;
  padding-right: 5%;
}
.bold-text {
  font-weight: bold;
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
.fake-link {
  cursor: pointer;
  color: #0645AD;
}
.fake-link:hover {
  color: dodgerblue;
}
.fake-link:active {
  color: darkorange;
}
</style>