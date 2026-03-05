document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('apod-form');
    const dateInput = document.getElementById('date-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = document.getElementById('btn-loader');

    const resultContainer = document.getElementById('result-container');
    const mediaContainer = document.getElementById('media-container');
    const titleEl = document.getElementById('apod-title');
    const dateBadge = document.getElementById('apod-date-display');
    const descriptionEl = document.getElementById('apod-description');
    const copyrightEl = document.getElementById('apod-copyright');

    const errorCard = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Set max date to today in local time
    const today = new Date();
    // Offset to get correct YYYY-MM-DD for local timezone
    const offset = today.getTimezoneOffset();
    const todayLocal = new Date(today.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    dateInput.max = todayLocal;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedDate = dateInput.value;
        if (!selectedDate) return;

        // UI State: Loading
        setLoading(true);
        hideResult();
        hideError();

        try {
            // Point to backend server. Default port is 8000 for FastAPI locally.
            const response = await fetch(`http://127.0.0.1:8000/apod?date=${selectedDate}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro do servidor: ${response.status}`);
            }

            const data = await response.json();
            renderResult(data);
        } catch (error) {
            console.error("Error fetching APOD:", error);
            let errorMessage = error.message;
            if (errorMessage === "Failed to fetch") {
                errorMessage = "Não foi possível conectar ao servidor. Certifique-se de que o backend (start_backend.bat) está rodando e aberto em um terminal.";
            }
            showError(errorMessage || "Não foi possível carregar os dados. Verifique a chave de API e se o servidor está rodando.");
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    }

    function renderResult(data) {
        // Clear previous media
        mediaContainer.innerHTML = '';

        // Title and Date
        titleEl.textContent = data.title;

        // Format date string beautifully
        const dateObj = new Date(data.date + 'T00:00:00'); // Force local interpretation of the specific date
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        dateBadge.textContent = dateObj.toLocaleDateString('pt-BR', dateOptions);

        // Media
        if (data.media_type === 'image') {
            const img = document.createElement('img');
            img.src = data.url;
            img.alt = data.title;
            // Optionally add high-res link if hdurl is present
            if (data.hdurl) {
                const a = document.createElement('a');
                a.href = data.hdurl;
                a.target = '_blank';
                a.title = 'Clique para abrir imagem em alta resolução';
                a.appendChild(img);
                mediaContainer.appendChild(a);
            } else {
                mediaContainer.appendChild(img);
            }
        } else if (data.media_type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.src = data.url;
            iframe.allowFullscreen = true;
            mediaContainer.appendChild(iframe);
        } else {
            mediaContainer.textContent = 'Tipo de mídia não suportado.';
        }

        // Description
        descriptionEl.textContent = data.explanation;

        // Copyright (optional field in NASA API)
        if (data.copyright) {
            copyrightEl.textContent = `© ${data.copyright.replace(/\n/g, '')}`;
            copyrightEl.style.display = 'block';
        } else {
            copyrightEl.style.display = 'none';
        }

        // Show result
        resultContainer.classList.remove('hidden');

        // Scroll to result slightly
        setTimeout(() => {
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function hideResult() {
        resultContainer.classList.add('hidden');
    }

    function showError(message) {
        errorText.textContent = message;
        errorCard.classList.remove('hidden');
    }

    function hideError() {
        errorCard.classList.add('hidden');
    }
});
