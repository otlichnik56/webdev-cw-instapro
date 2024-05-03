import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const render = () => {
    
    const formHtml =  `
      <div class="page-container">
        <div class="header-container">
        </div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">

            <div class="upload-image-container"></div>

            <label>
              Опишите фотографию:
              <textarea id="input_text" class="input textarea" rows="4">${description}</textarea>
              </label>
              <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    const appHtml = `
        <div class="page-container">
          <div class="header-container"></div>
          <ul class="posts">
            ${formHtml}                    
          </ul>
        </div>`;

    appEl.innerHTML = appHtml;
    
    renderHeaderComponent({
    element: document.querySelector(".header-container"),
    });
    
    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    appEl.querySelector(".file-upload-remove-button")?.addEventListener("click", () => {
        imageUrl = "";
        //onAddPostClick(description, imageUrl);
        render();
    });

    document.getElementById("add-button").addEventListener("click", () => {

      const text = document.getElementById("input_text");
      description = text.value;
      
      if (checkText(description) === false) {
        alert("Введите описание");
        return;
      }

      if (imageUrl  === "") {
        alert("Не выбрана фотография");
        return;
      }

      onAddPostClick({
        description: symbol(description),
        imageUrl: imageUrl,
      });
    });

  };

  render();
}

function symbol(text) {
  return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function checkText(text) {
  const checker = text.replaceAll(" ", "")
  if(checker === ""){
    return false;
  } else {
    return true;
  }

}