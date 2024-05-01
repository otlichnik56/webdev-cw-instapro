import { uploadImage } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const render = () => {
    
    // TODO: Реализовать страницу добавления поста !!!!!!!!!!!
    const formHtml =  `
      <div class="page-container">
        <div class="header-container">
        </div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
                <div class="upload=image">
                    ${
                      imageUrl
                        ? `
                        <div class="file-upload-image-conrainer">
                          <img class="file-upload-image" src="${imageUrl}">
                          <button class="file-upload-remove-button button">Заменить фото</button>
                        </div>
                        `
                        : `
                          <label class="file-upload-label secondary-button">
                              <input
                                type="file"
                                class="file-upload-input"
                                style="display:none"
                              />
                              Выберите фото
                          </label>              
                    `
                    }
                </div>
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
    
    const fileInputElement = appEl.querySelector(".file-upload-input");    

    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const lableEl = document.querySelector(".file-upload-label");
        lableEl.setAttribute("disabled", true);
        lableEl.textContent = "Загружаю файл...";
        uploadImage({ file }).then(({ fileUrl }) => {   
          imageUrl = fileUrl;
          render();
        });
      }
    });

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