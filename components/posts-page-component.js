import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp } from "../index.js";
import { isLikedPost } from "../api.js";

//import { formatDistanceToNow } from "date-fns"
//import { ru } from 'date-fns/locale';

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const commentHtml = posts.map((post) => {
    return ` 
        <li class="post" id="post-${post.id}">
          <div class="post-header" data-user-id="${post.user.id}"> 
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${symbol(post.user.name)}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="${like(post.isLiked)}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${numLikes(post.likes)}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${symbol(post.user.name)}</span> "${post.description}"
          </p>
          <p class="post-date">
          ${post.createdAt}
          </p>
        </li>`
      }).join("");
      //${formatDistanceToNow(post.createdAt, {locale: ru})}
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${commentHtml}                    
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  
  for (let likedEl of document.querySelectorAll(".like-button")) {
    likedEl.addEventListener("click", () => {
      const postId = likedEl.getAttribute("data-post-id");
      const post = posts.find(post => post.id === postId);
      const id = post.id;
      const isLiked = post.isLiked;
      const token = getToken();
      if(token !== undefined){
        isLikedPost({ token: getToken(), id: id, isLiked: isLiked })
          .then((updatedPost) => {
            updatePost(updatedPost, posts);  
            renderApp();        
          })
          .catch((error) => {
            console.error(error);
        });
      } else {
        alert("Необходимо авторизоваться или зарегистрироваться!");
      }
    });
  }
}


function like(isLiked) {
  if(isLiked === true){
    return "./assets/images/like-active.svg";
  } else {
    return "./assets/images/like-not-active.svg"
  }
}

function numLikes(likes) {
  if(likes.length === 0){
    return "0";
  } else if(likes.length === 1){
    return symbol(likes[0].name);
  } else {
    return symbol(likes[0].name) + " и ещё " + (likes.length - 1)
  }
}

function symbol(text) {
  return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}


export function updatePost(updatedPost, posts) {
  const index = posts.findIndex(post => post.id === updatedPost.id);
  if (index !== -1) {
      posts[index] = updatedPost;
      renderPost(updatedPost);
  }
}

function renderPost(post) {
  const postElement = document.getElementById(`post-${post.id}`);
  if (postElement) {
    postElement.innerHTML = `
        <li class="post" id="post-${post.id}">
        <div class="post-header" data-user-id="${post.user.id}"> 
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${symbol(post.user.name)}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${like(post.isLiked)}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${numLikes(post.likes)}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${symbol(post.user.name)}</span> "${post.description}"
        </p>
        <p class="post-date">
        ${post.createdAt}
        </p>
      </li>`;
  }

  //${formatDistanceToNow(post.createdAt, {locale: ru})}

}