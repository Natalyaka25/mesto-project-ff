
import {
  openModal,
} from "./components/modal.js";

export const popupProfileAvatar = document.querySelector(".popup_type_edit-avatar"); //popup для аватара
export const formProfileAvatar = document.forms["edit-avatar"]; // форма аватара
export const openProfileAvatar = document.querySelector(".profile__image");



/** Функция открытия попапа аватара **/
export function handleOpenAvatar() {
  console.log("Клик по аватару зарегистрирован!"); // Проверка
  openModal(popupProfileAvatar);
}
  // patchProfileAvatare();