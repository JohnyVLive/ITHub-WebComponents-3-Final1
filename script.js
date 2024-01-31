customElements.define('x-comment', class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <link href="styles-comments.css" rel="stylesheet">
      <textarea id="commentInput" placeholder="Введите ваш комментарий" rows="4"></textarea>
      <button id="submitBtn">Ответить</button>
      <div class="comments"></div>
    `;

    shadowRoot.getElementById('submitBtn').addEventListener('click', () => {
      const comment = document.createElement('div');
      comment.className = 'comment';
      const commentTemplate = document.getElementById('commentTemplate');
      const content = commentTemplate.content.cloneNode(true);
      comment.appendChild(content);

      //Вставляем текст введённый в textarea в слот
      let textContent = shadowRoot.getElementById('commentInput').value
      if (textContent === "") {
        alert("Пустой комментарий");
      }
      else{
        comment.querySelector('slot').textContent = textContent
        shadowRoot.querySelector('.comments').appendChild(comment);
        shadowRoot.getElementById('commentInput').value = '';

        // Устанавливаем лиснеры к комментарию
        this.setListeners(comment);
      }

    });
  }

  setListeners(comment) {

    // Действие по кнопке лайк
    comment.querySelector('.like-btn').addEventListener('click', () => {
      const count = comment.querySelector('.like-count');
      count.textContent = parseInt(count.textContent) + 1;
    });

    // Действие по кнопке удаления
    comment.querySelector('.delete-btn').addEventListener('click', () => {
      comment.remove();
    });

    // Действие по кнопке ответа
    comment.querySelector('.reply-btn').addEventListener('click', () => {

      const innerComments = comment.querySelector('.inner-comments');
      const innerCommentInput = document.createElement('textarea');
      innerCommentInput.placeholder = 'Введите ваш комментарий';
      innerComments.appendChild(innerCommentInput);

      const innerSubmitBtn = document.createElement('button');
      innerSubmitBtn.textContent = 'Отправить';
      innerComments.appendChild(innerSubmitBtn);

      innerSubmitBtn.addEventListener('click', () => {
        const innerComment = document.createElement('div');
        innerComment.className = 'comment';
        const commentTemplate = document.getElementById('commentTemplate');
        const content = commentTemplate.content.cloneNode(true);
        innerComment.appendChild(content);

        let textContent = innerCommentInput.value
        if (textContent === "") {
          alert("Пустой комментарий");
        }
        else{
          innerComment.querySelector('slot').textContent = textContent
          innerComments.insertBefore(innerComment, innerCommentInput);
          innerCommentInput.remove();
          innerSubmitBtn.remove();
        }
        this.setListeners(innerComment);
      });
    });
  }
});