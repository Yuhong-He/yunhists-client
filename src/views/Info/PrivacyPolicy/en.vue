<template>
  <div class="privacy-container">
    <div class="privacy-title">
      Privacy Policy
    </div>
    <div class="privacy-body">
      <p style="margin-bottom: 20px;">Yunhists ("us", "we", or "our") operates the website yunnanhistory.com (the "Site"). This page informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the Site.</p>
      <ol class="privacy-list">
        <li>
          <p class="bold-text">Information Collection and Use</p>
          <p>We collect personal information from users who sign up for our services, including their name and email address. We use this information to provide our services to you and to communicate with you about your account.</p>
        </li>
        <li>
          <p class="bold-text">Data Storage and Transfer</p>
          <p>Your personal information will be stored and processed in Hong Kong. By using the Site, you consent to the transfer of your personal information to Hong Kong.</p>
        </li>
        <li>
          <p class="bold-text">Information Sharing and Disclosure</p>
          <p>We do not sell, trade, or otherwise transfer your personal information to outside parties. However, we may disclose your personal information in the following circumstances:</p>
          <ul class="privacy-inner-list">
            <li>To comply with applicable laws or regulations</li>
            <li>To protect the rights, property, or safety of Yunhists, our users, or others</li>
          </ul>
        </li>
        <li>
          <p class="bold-text">Data Security</p>
          <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, please be aware that no method of transmitting information over the Internet or storing information is completely secure.</p>
        </li>
        <li>
          <p class="bold-text">Cookies</p>
          <p>We use cookies to improve your experience on our Site. You can choose to disable cookies in your browser settings if you prefer not to accept them.</p>
        </li>
        <li>
          <p class="bold-text">Children's Privacy</p>
          <p>Our Site is not intended for children under the age of 16, and we do not knowingly collect personal information from anyone under the age of 16. If we become aware that we have collected personal information from a child under the age of 16, we will delete that information.</p>
        </li>
        <li>
          <p class="bold-text">Right to Delete Personal Data</p>
          <p>You have the right to delete any personal information that we have collected from you. If you wish to exercise the right, please do so at your <span class="fake-link" @click="$router.push('/profile/UserInfo')">user page</span>. Please note that we may need to retain certain information for record-keeping purposes or to complete contributions that you have initiated prior to requesting deletion.</p>
        </li>
        <li>
          <p class="bold-text">Compliance with Hong Kong PDPO, China PIPL, and GDPR</p>
          <p>We comply with the Hong Kong Personal Data (Privacy) Ordinance (PDPO), the China Personal Information Protection Law (PIPL), and the EU General Data Protection Regulation (GDPR). This means that we will:</p>
          <ul class="privacy-inner-list">
            <li>Only collect personal information that is necessary for the purposes for which it is collected;</li>
            <li>Obtain your consent before collecting, using, or disclosing your personal information, except in certain circumstances permitted by law;</li>
            <li>Take reasonable steps to ensure that the personal information we collect is accurate, complete, and up-to-date;</li>
            <li>Use personal information only for the purposes for which it was collected or for purposes directly related to those purposes, unless we have obtained your consent or are required or permitted by law to use it for other purposes;</li>
            <li>Retain personal information only as long as necessary for the fulfillment of the purposes for which it was collected, or as required by law;</li>
            <li>Implement appropriate technical and organizational measures to protect personal information against unauthorized or accidental access, processing, erasure, loss, or use; and</li>
            <li>Provide you with access to your personal information and allow you to correct, update, or delete your personal information upon request, as permitted by law.</li>
            <li>If you are located in the EU and wish to exercise your rights under GDPR, including the right to access, rectify, erase, restrict processing, data portability, and object to processing, please contact us at <a :href="'mailto:' + email">{{ this.email }}</a>. We will respond to your inquiry as soon as possible.</li>
          </ul>
        </li>
      </ol>
      <p style="margin-top: 20px;">If you have any questions about this privacy policy, please contact us at <a :href="'mailto:' + email">{{ this.email }}</a>.</p>
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