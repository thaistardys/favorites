// 1. INICIALIZAÇÃO DO SISTEMA (AGUARDA O CARREGAMENTO COMPLETO DO HTML)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('favorites-container');
    const form = document.getElementById('favorite-form');
    const openAddModalBtn = document.getElementById('open-add-modal-btn');
    const searchInput = document.getElementById('search-input');
    
    // Mapeamento explícito de todos os Modais
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

    // Gerenciamento de Abertura do Modal de Cadastro
    openAddModalBtn.addEventListener('click', () => {
        toggleModal(addModal);
    });
    
    // Filtro em Tempo Real
    searchInput.addEventListener('input', () => {
        renderAllCards(searchInput.value.trim());
    });

    // Fechamento Inteligente de Modais pela classe .close-modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const openModal = e.target.closest('.modal-overlay');
            toggleModal(openModal);
            if (openModal === addModal) form.reset();
        });
    });

    // 3. EVENTOS ADMINISTRATIVOS (CRUD)
    confirmDeleteBtn.addEventListener('click', () => {
        if (idItemParaDeletar !== null) {
            favoritesList = favoritesList.filter(item => item.id !== idItemParaDeletar);
            renderAllCards(searchInput.value.trim());
            saveToLocalStorage();
            toggleModal(deleteModal);
            idItemParaDeletar = null;
        }
    });

    // Submissão do Formulário de Criação (Dentro do Modal)
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        let url = document.getElementById('url').value.trim();
        let imageUrl = document.getElementById('image-url').value.trim();

        url = formatProtocol(url);
        imageUrl = formatProtocol(imageUrl);

        if (!validateInputs(url, imageUrl)) return;

        const newItem = { id: Date.now(), title, url, imageUrl, isStarred: false };
        favoritesList.push(newItem);
        
        searchInput.value = ''; // Reseta a barra de pesquisa
        renderAllCards();
        saveToLocalStorage();
        form.reset();
        toggleModal(addModal);
    });

    // Submissão do Formulário de Edição
    editForm.addEventListener('submit', (event) => {
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
            const oldStarStatus = favoritesList[index].isStarred;
            favoritesList[index] = { id, title, url, imageUrl, isStarred: oldStarStatus };
            renderAllCards(searchInput.value.trim());
            saveToLocalStorage();
            toggleModal(editModal);
        }
    });

    // 4. FUNÇÕES DE SUPORTE E VALIDAÇÃO
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
        if (modalElement) modalElement.classList.toggle('active');
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

    // Gerencia o clique da estrela e dispara a reordenação em tempo real
    function toggleStarFavorite(id) {
        const index = favoritesList.findIndex(item => item.id !== id);
        const targetItem = favoritesList.find(item => item.id === id);
        if (targetItem) {
            targetItem.isStarred = !targetItem.isStarred;
            renderAllCards(searchInput.value.trim());
            saveToLocalStorage();
        }
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

    // 5. CONSTRUTOR DINÂMICO DE ELEMENTOS HTML (DOM)
    function createCardElement(item) {
        const domain = new URL(item.url).hostname.replace('www.', '');
        const initials = item.title.substring(0, 2).toUpperCase();
        const finalLogoUrl = item.imageUrl ? item.imageUrl : `https://vemetric.com{domain}?sz=128`;

        const card = document.createElement('div');
        card.classList.add('card');

        // Cria e configura o botão de estrela
        const starBtn = document.createElement('button');
        starBtn.type = 'button';
        starBtn.classList.add('star-btn');
        if (item.isStarred) starBtn.classList.add('active');
        starBtn.innerHTML = '★';
        starBtn.addEventListener('click', () => toggleStarFavorite(item.id));
        card.appendChild(starBtn);

        const h3 = document.createElement('h3');
        h3.textContent = item.title;
        card.appendChild(h3);

        // Logo/Imagem transformada em link clicável
        const logoLink = document.createElement('a');
        logoLink.href = item.url;
        logoLink.target = '_blank';
        logoLink.classList.add('logo-link');

        const logoContainer = document.createElement('div');
        logoContainer.style.cssText = 'width: 96px; height: 96px; display: flex; align-items: center; justify-content: center;';

        const img = document.createElement('img');
        img.src = finalLogoUrl;
        img.alt = `Logo de ${item.title}`;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; border-radius: 6px;';

        // Desenha o círculo com as iniciais em texto caso o link ou favicon quebre
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

        // Painel Administrativo Inferior do Card (Botões Menores)
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
        return card;
    }

    // 6. CONTROLADOR DE RENDERIZAÇÃO E ORDENAÇÃO POR ESTRELA
    function renderAllCards(filterText = '') {
        container.innerHTML = '';

        // Estado Inicial Vazio (Aplica a classe CSS .empty-state para centralização absoluta)
        if (favoritesList.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-state';
            emptyMessage.textContent = 'Nenhum favorito cadastrado ainda. Clique em "+ Novo Favorito" para começar!';
            container.appendChild(emptyMessage);
            return;
        }

        // Filtra a lista unificada com base na barra de pesquisas em tempo real
        let filteredList = favoritesList.filter(item => 
            item.title.toLowerCase().includes(filterText.toLowerCase())
        );


					        // Estado de Busca Sem Resultados
        if (filteredList.length === 0 && filterText !== '') {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.className = 'empty-state';
            noResultsMessage.textContent = `Nenhum favorito encontrado para "${filterText}".`;
            container.appendChild(noResultsMessage);
            return;
        }

        // ORDENAÇÃO INTELIGENTE: Puxa todos os itens marcados com estrela para o início da lista única
        filteredList.sort((a, b) => {
            if (a.isStarred && !b.isStarred) return -1;
            if (!a.isStarred && b.isStarred) return 1;
            return 0;
        });

        // Desenha na tela a lista unificada devidamente ordenada
        filteredList.forEach(item => {
            container.appendChild(createCardElement(item));
        });
    }

    // Dispara a leitura inicial após o mapeamento completo e seguro do DOM
    loadFavorites();
});
