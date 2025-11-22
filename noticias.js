document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DO DOM ---
    const newsContainer = document.getElementById('news-container');
    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // --- LÓGICA DO MENU DE NAVEGAÇÃO (reutilizada) ---
    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            if (dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // Carrega os dados das notícias do arquivo JSON
    // O loader já está no HTML, então o usuário o vê imediatamente.
    // Agora, vamos buscar os dados.

    // Voltando a buscar do arquivo local para simplificar e garantir que funcione sempre.
    fetch('noticias.json')
        .then(response => response.json())
        .then(data => {
            // Ordena as notícias da mais recente para a mais antiga
            const sortedNews = data.sort((a, b) => new Date(b.data) - new Date(a.data));
            
            displayNews(sortedNews);
        })
        .catch(error => {
            console.error('Erro ao carregar as notícias:', error);
            newsContainer.innerHTML = '<p>Não foi possível carregar as notícias. Tente novamente mais tarde.</p>';
        });

    /**
     * Exibe as notícias na tela.
     * @param {Array} newsList - A lista de notícias a ser exibida.
     */
    function displayNews(newsList) {
        newsContainer.innerHTML = '';

        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';

        newsList.forEach(newsItem => {
            const newsCard = document.createElement('a');
            newsCard.className = 'news-card';
            newsCard.href = newsItem.link; // Usando o campo 'link' do nosso JSON
            newsCard.target = '_blank';
            newsCard.rel = 'noopener noreferrer';
            newsCard.style.textDecoration = 'none'; // Remove sublinhado do link

            // Verifica se a notícia tem uma imagem para renderizar o card de forma condicional
            const imageHTML = newsItem.imagem
                ? `
                    <div class="news-card-image">
                        <img src="${newsItem.imagem}" alt="Imagem da notícia: ${newsItem.titulo}">
                    </div>
                  `
                : '';

            newsCard.innerHTML = `
                ${imageHTML}
                <div class="news-card-content">
                    <h3>${newsItem.titulo}</h3>
                    <p class="news-card-meta">Fonte: ${newsItem.fonte} - Data: ${new Date(newsItem.data).toLocaleDateString()}</p>
                    <p>${newsItem.resumo || 'Clique para ler mais.'}</p>
                </div>
            `;
            newsGrid.appendChild(newsCard);
        });

        newsContainer.appendChild(newsGrid);
    }
});

// --- NAVEGAÇÃO SUAVE COM O TECLADO ---
document.addEventListener('keydown', (event) => {
    // Quantidade de pixels para rolar a cada pressionamento de tecla
    const scrollAmount = 80;

    if (event.key === 'ArrowDown') {
        event.preventDefault(); // Impede a rolagem padrão do navegador
        window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth' // Faz a rolagem ser suave
        });
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Impede a rolagem padrão do navegador
        window.scrollBy({
            top: -scrollAmount,
            behavior: 'smooth' // Faz a rolagem ser suave
        });
    }
});