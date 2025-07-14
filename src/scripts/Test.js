

export const openProfileAvatar = document.querySelector(".profile__image");
export const popupProfileAvatar = document.querySelector(".popup_type_edit-avatar"); //popup для открытия карточки
export const imageAvatar = popupProfileAvatar.querySelector(".popup__image"); //popup картинки
export const popupProfile = document.querySelector(".popup_type_edit"); //popup профиля


/** Функция открытия карточки popup **/
export function handleOpenAvatar() {
  // imageAvatar.src = link;
  openModal(popupProfile);
}


  openProfileAvatar.addEventListener("click", () => {
    handleOpenAvatar();
  });


  // patchProfileAvatare();