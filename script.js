document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('favorites-container');
    const form = document.getElementById('favorite-form');
    const openAddModalBtn = document.getElementById('open-add-modal-btn');
    const searchInput = document.getElementById('search-input'); // Novo elemento capturado
    
    const addModal = document.getElementById('add-modal');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    const editIdInput = document.getElementById('edit-id');
    const editTitleInput = document.getElementById('edit-title');
    const editUrlInput = document.getElementById('edit-url');
    const editImageUrlInput = document.getElementById('edit-image-url');

    let idItemParaDeletar = null;
    let favoritesList = [];

    openAddModalBtn.addEventListener('click', () => toggleModal(addModal));
    
    // Escuta em tempo real o que o usuário digita na barra de busca
    searchInput.addEventListener('input', () => {
        renderAllCards(searchInput.value.trim());
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const openModal = e.target.closest('.modal-overlay');
            toggleModal(openModal);
            if (openModal === addModal) form.reset();
        });
    });

    confirmDeleteBtn.addEventListener('click', function() {
        if (idItemParaDeletar !== null) {
            favoritesList = favoritesList.filter(item => item.id !== idItemParaDeletar);
            renderAllCards(searchInput.value.trim()); // Mantém o filtro atual ao deletar
            saveToLocalStorage();
            toggleModal(deleteModal);
            idItemParaDeletar = null;
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        let url = document.getElementById('url').value.trim();
        let imageUrl = document.getElementById('image-url').value.trim();

        url = formatProtocol(url);
        imageUrl = formatProtocol(imageUrl);

        if (!validateInputs(url, imageUrl)) return;

        const favoriteItem = { id: Date.now(), title, url, imageUrl };
        favoritesList.push(favoriteItem);
        
        searchInput.value = ''; // Limpa a busca ao cadastrar um novo para exibi-lo imediatamente
        renderAllCards();
        saveToLocalStorage();
        form.reset();
        toggleModal(addModal);
    });

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
            renderAllCards(searchInput.value.trim()); // Mantém o termo pesquisado ao salvar a edição
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
        }
        renderAllCards();
    }

    function saveToLocalStorage() {
        localStorage.setItem('my_favorites_links', JSON.stringify(favoritesList));
    }

    // Função de renderização refatorada para aceitar o parâmetro opcional de filtro
    function renderAllCards(filterText = '') {
        container.innerHTML = '';

        // Se o banco local estiver completamente vazio, exibe o estado padrão de início
        if (favoritesList.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Nenhum favorito cadastrado ainda. Clique em "+ Novo Favorito" para começar!';
            emptyMessage.style.cssText = 'width: 100%; text-align: center; padding: 2.5rem 1rem; color: var(--text-color); font-weight: bold; font-size: 1.1rem;';
            container.appendChild(emptyMessage);
            return;
        }

        // Filtra a lista baseando-se no que foi digitado (converte tudo para minúsculo)
        const filteredList = favoritesList.filter(item => 
            item.title.toLowerCase().includes(filterText.toLowerCase())
        );

        // Se o usuário digitou algo na busca mas nada coincidiu, exibe uma mensagem específica de busca sem resultados
        if (filteredList.length === 0 && filterText !== '') {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = `Nenhum favorito encontrado para "${filterText}".`;
            noResultsMessage.style.cssText = 'width: 100%; text-align: center; padding: 2.5rem 1rem; color: var(--text-color); font-weight: bold; font-size: 1.1rem;';
            container.appendChild(noResultsMessage);
            return;
        }

        // Renderiza apenas os itens filtrados na tela
        filteredList.forEach(item => {
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
            logoContainer.style.cssText = 'width: 96px; height: 96px; display: flex; align-items: center; justify-content: center;';

            const img = document.createElement('img');
            img.src = finalLogoUrl;
            img.alt = `Logo de ${item.title}`;
            img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; border-radius: 6px;';

            img.onerror = function() {
                img.remove(); 
                const fallback = document.createElement('div');
                fallback.style.cssText = 'width: 100%; height: 100%; background-color: var(--detail-color); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 2rem; border-radius: 50%;';
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

    loadFavorites();
});

