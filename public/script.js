document.addEventListener('DOMContentLoaded', () => {
    // --- VARIÁVEIS DE SIMULAÇÃO ---
    // Em um sistema real, este seria o seu banco de dados de chaves válidas.
    let validKeys = new Set();
    
    // Elementos DOM
    const keyForm = document.getElementById('key-form');
    const apiKeyInput = document.getElementById('api-key');
    const messageArea = document.getElementById('message');

    // --- FUNÇÕES DE SIMULAÇÃO DE BACKEND (API) ---

    /**
     * Gera uma string alfanumérica aleatória de comprimento especificado.
     */
    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Cria uma chave API aleatória no formato KEY-SPARKXXXXX-XXXXXX-09.
     */
    function createRandomKey() {
        const part1 = generateRandomString(5); 
        const part2 = generateRandomString(6); 
        return `KEY-SPARK${part1}-${part2}-09`;
    }

    /**
     * Simula a validação da chave API pelo servidor.
     */
    async function validateKeyApi(key) {
        // Simula a latência da chamada API
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        // Simulação: verifica se a chave está no nosso set de chaves válidas.
        return validKeys.has(key);
    }

    /**
     * Gera um Token de Sessão único para ser salvo no LocalStorage.
     */
    function generateSessionToken() {
        // Gera um token mais complexo para fins de segurança (simulação)
        return 'TOKEN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    }

    // --- LÓGICA DE UI E INICIALIZAÇÃO ---

    // Gera 5 chaves válidas no início para teste e adiciona a chave de exemplo.
    for (let i = 0; i < 5; i++) {
        validKeys.add(createRandomKey());
    }
    validKeys.add("KEY-SPARK15930-B1C47E-09"); 
    console.log("Chaves Válidas Geradas (Teste):", Array.from(validKeys));

    /**
     * Exibe uma mensagem de status na tela de login.
     */
    function showMessage(msg, isSuccess) {
        messageArea.textContent = msg;
        messageArea.classList.remove('message-success', 'message-error');
        
        if (msg) {
            messageArea.classList.add(isSuccess ? 'message-success' : 'message-error');
            messageArea.style.display = 'block';
        } else {
            messageArea.style.display = 'none';
        }
    }

    // --- EVENT LISTENERS (LÓGICA PRINCIPAL) ---

    // Lógica de Submissão do Formulário (Validação API e Redirecionamento)
    if (keyForm) {
        keyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const key = apiKeyInput.value.trim();
            showMessage('Verificando chave via API...', false); 

            const isValid = await validateKeyApi(key);

            if (isValid) {
                // 1. GERA E SALVA O TOKEN NO LOCAL STORAGE (Permite acesso ao hub)
                const sessionToken = generateSessionToken();
                localStorage.setItem('spark_session_token', sessionToken);
                
                showMessage('Chave válida! Redirecionando para o Hub...', true);
                
                // 2. REDIRECIONA PARA O HUB
                setTimeout(() => {
                    window.location.href = 'hub.html'; 
                }, 1500); 
            } else {
                // 3. SE INVÁLIDO, REMOVE QUALQUER TOKEN ANTIGO E MOSTRA ERRO
                localStorage.removeItem('spark_session_token');
                showMessage('ERRO: Chave API inválida ou expirada.', false);
            }
        });
    }
});