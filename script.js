const form = document.getElementById('favorite-form');
const container = document.getElementById('favorites-container');

// Elementos do Modal de Edição
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const editIdInput = document.getElementById('edit-id');
const editTitleInput = document.getElementById('edit-title');
const editUrlInput = document.getElementById('edit-url');
const editImageUrlInput = document.getElementById('edit-image-url');

// Elementos do Modal de Exclusão
const deleteModal = document.getElementById('delete-modal');
const closeDeleteModalBtn = document.getElementById('close-delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

let idItemParaDeletar = null;
let favoritesList = [];

// Inicialização
document.addEventListener('DOMContentLoaded', loadFavorites);
closeEditModalBtn.addEventListener('click', () => toggleModal(editModal));
closeDeleteModalBtn.addEventListener('click', () => toggleModal(deleteModal));

// Ação de Exclusão
confirmDeleteBtn.addEventListener('click', function() {
    if (idItemParaDeletar !== null) {
        favoritesList = favoritesList.filter(item => item.id !== idItemParaDeletar);
        renderAllCards();
        saveToLocalStorage();
        toggleModal(deleteModal);
        idItemParaDeletar = null;
    }
});

// Envio do formulário principal
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    let url = document.getElementById('url').value.trim();
    let imageUrl = document.getElementById('image-url').value.trim();

    url = formatProtocol(url);
    imageUrl = formatProtocol(imageUrl);

    if (!validateInputs(url, imageUrl)) return;

    const favoriteItem = {
        id: Date.now(),
        title,
        url,
        imageUrl
    };

    favoritesList.push(favoriteItem);
    renderAllCards();
    saveToLocalStorage();
    form.reset();
});

// Envio do formulário de edição
editForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const id = parseInt(editIdInput.value);
    const title = editTitleInput.value.trim();
    let url = editUrlInput.value.trim();
    let imageUrl = editImageUrlInput.value.trim();

    url = formatProtocol(url);
    imageUrl = formatProtocol(imageUrl);

    if (!validateInputs(url, imageUrl)) return;

    const index = favoritesList.findIndex(item => item.id === id);
    if (index !== -1) {
        favoritesList[index] = { id, title, url, imageUrl };
        renderAllCards();
        saveToLocalStorage();
        toggleModal(editModal);
    }
});

function formatProtocol(string) {
    if (!string || /^data:/i.test(string)) return string;
    if (!/^https?:\/\//i.test(string)) return 'https://' + string;
    return string;
}

function validateInputs(url, imageUrl) {
    if (!isValidURL(url)) {
        alert('Por favor, insira uma URL de site válida.');
        return false;
    }
    if (imageUrl && !/^data:/i.test(imageUrl) && !isValidURL(imageUrl)) {
        alert('Por favor, insira uma URL de imagem válida.');
        return false;
    }
    return true;
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

function toggleModal(modalElement) {
    modalElement.classList.toggle('active');
}

function openEditModal(item) {
    editIdInput.value = item.id;
    editTitleInput.value = item.title;
    editUrlInput.value = item.url;
    editImageUrlInput.value = item.imageUrl || '';
    toggleModal(editModal);
}

function openDeleteModal(id) {
    idItemParaDeletar = id;
    toggleModal(deleteModal);
}

function loadFavorites() {
    const storageData = localStorage.getItem('my_favorites_links');
    if (storageData) {
        favoritesList = JSON.parse(storageData);
        renderAllCards();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('my_favorites_links', JSON.stringify(favoritesList));
}

function renderAllCards() {
    container.innerHTML = '';
    favoritesList.forEach(item => {
        const domain = new URL(item.url).hostname.replace('www.', '');
        const initials = item.title.substring(0, 2).toUpperCase();
        const finalLogoUrl = item.imageUrl ? item.imageUrl : `https://vemetric.com{domain}?sz=128`;

        const card = document.createElement('div');
        card.classList.add('card');

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        card.appendChild(h3);

        const logoLink = document.createElement('a');
        logoLink.href = item.url;
        logoLink.target = '_blank';
        logoLink.classList.add('logo-link');
        logoLink.title = `Acessar ${item.title}`;

        const logoContainer = document.createElement('div');
        logoContainer.style.width = '96px';
        logoContainer.style.height = '96px';
        logoContainer.style.display = 'flex';
        logoContainer.style.alignItems = 'center';
        logoContainer.style.justifyContent = 'center';

        const img = document.createElement('img');
        img.src = finalLogoUrl;
        img.alt = `Logo de ${item.title}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '6px';

        img.onerror = function() {
            img.remove(); 
            const fallback = document.createElement('div');
            fallback.style.width = '100%';
            fallback.style.height = '100%';
            fallback.style.backgroundColor = 'var(--detail-color)';
            fallback.style.color = '#FFFFFF';
            fallback.style.display = 'flex';
            fallback.style.alignItems = 'center';
            fallback.style.justifyContent = 'center';
            fallback.style.fontWeight = 'bold';
            fallback.style.fontSize = '2rem';
            fallback.style.borderRadius = '50%';
            fallback.textContent = initials;
            logoContainer.appendChild(fallback);
        };

        logoContainer.appendChild(img);
        logoLink.appendChild(logoContainer);
        card.appendChild(logoLink);

        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions');

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.classList.add('edit-btn');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => openEditModal(item));
        actionsContainer.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => openDeleteModal(item.id));
        actionsContainer.appendChild(deleteBtn);

        card.appendChild(actionsContainer);
        container.appendChild(card);
    });
}
