import Vue from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
    faLanguage,
    faEllipsisVertical,
    faMagnifyingGlass,
    faBookOpen,
    faHouse,
    faFolderTree,
    faUser,
    faRightToBracket,
    faGear,
    faQuestion,
    faCircleCheck,
    faCircleMinus,
    faCircleXmark,
    faKey,
    faEnvelope,
    faRegistered,
    faUserGroup,
    faAward
} from '@fortawesome/free-solid-svg-icons';

import {
    faCopyright,
    faAddressCard,
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';

import {
    faGoogle
} from '@fortawesome/free-brands-svg-icons';

library.add(faCopyright);
library.add(faLanguage);
library.add(faEllipsisVertical);
library.add(faMagnifyingGlass);
library.add(faBookOpen);
library.add(faHouse);
library.add(faFolderTree);
library.add(faUser);
library.add(faRightToBracket);
library.add(faGear);
library.add(faGoogle);
library.add(faQuestion);
library.add(faCircleCheck);
library.add(faCircleMinus);
library.add(faCircleXmark);
library.add(faAddressCard);
library.add(faKey);
library.add(faEnvelope);
library.add(faRegistered);
library.add(faUserGroup);
library.add(faPenToSquare);
library.add(faAward);

Vue.component('font-awesome-icon', FontAwesomeIcon);