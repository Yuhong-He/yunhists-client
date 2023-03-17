<template>
  <div class="about-container">
    <div class="about-title">
      About
    </div>
    <div class="about-body">
      <p><span class="bold-text">Yunhists</span>, short for <span class="bold-text">Yun</span>nan <span class="bold-text">His</span>tory <span class="bold-text">T</span>hesis <span class="bold-text">S</span>ystem, is a website dedicated to collecting historical theses on Yunnan. Its core is a multi-hierarchical classification system, and it also has two modules: user system and upload/approval system. This site focuses on the classification and arrangement of information. The primary function is to provide a list of papers by topic, which is convenient for users to have a more comprehensive understanding of the research conducted by the academic community on this topic. In addition, this site is open to the download of "public domain" copyright papers.</p>
      <p>I am an undergraduate computer science student who is enthusiastic about the history of Yunnan, and this website is my final year project. I had the idea to make this system when I was a sophomore in college. I stayed at home for a year due to COVID and started systematically collecting Yunnan history papers. The number has exceeded 8,000. It is not a minor difficulty to sort out materials of this scale, and the computer folder can only be "single-categorized". It cannot meet the requirements for the refined classification of papers. On the other hand, commercial thesis websites' search and labelling systems are often not satisfactory. It is difficult to find all relevant papers if they belong to the same topic but have different keywords. Furthermore, commercial thesis websites only provide papers published online, and many papers that are not published online and old papers are not included in the collection of commercial paper websites. The user upload function of this site allows users to upload papers not included in the system and will improve the collection and categorisation of Yunnan's historical theses with the concept of co-build philosophy.</p>
      <p>So far this website has not been fully completed, because the college only gave the final year project two months of development and dissertation time. There are still some functions that have not been completed, such as classification by journals, user favourites, etc. The current version is only a beta version and is used for submitting a final-year project. The official version will be launched after the development of more functions and the completion of content construction.</p>
      <p>Contact: <a :href="'mailto:' + email">{{ this.email }}</a></p>
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
</style>