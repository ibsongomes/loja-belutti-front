document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. OFFCANVAS (PAINEL INSTITUCIONAL LATERAL)
    ========================================= */
    const openSidebarBtns = document.querySelectorAll('.open-sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarPanel = document.getElementById('sidebarPanel');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const sidebarContent = document.getElementById('sidebarContent');

    const dadosPainel = {
        'quem-somos': {
            titulo: 'Quem Somos',
            conteudo: '<p>A Belutti surgiu com o propósito de levar moda masculina com estilo, atitude e personalidade. Reunimos peças que combinam conforto e versatilidade para acompanhar você em diferentes momentos.</p>'
        },
        'trocas': {
            titulo: 'Política de Trocas e Devoluções',
            conteudo: `
                <p><strong>Última atualização: 12 de novembro de 2026</strong></p>
                <p>Na Belutti, queremos que sua experiência de compra seja satisfatória. Por isso, estabelecemos esta Política de Trocas e Devoluções para explicar como funcionam as solicitações relacionadas aos produtos adquiridos em nosso site.</p>
                <p>Nosso objetivo é oferecer um atendimento transparente, respeitando os direitos previstos no Código de Defesa do Consumidor.</p>

                <h4>1. Direito de arrependimento — Compras online</h4>
                <p>Conforme o artigo 49 do Código de Defesa do Consumidor, o cliente que realizar uma compra pela internet poderá desistir da contratação no prazo de até <strong>7 (sete) dias corridos</strong>, contados a partir do recebimento do produto.</p>
                <p>Nesse caso:</p>
                <ul>
                    <li>Não é necessário apresentar uma justificativa para a desistência;</li>
                    <li>O cliente deverá comunicar a Belutti dentro do prazo legal;</li>
                    <li>A devolução deverá ser realizada conforme as orientações fornecidas pelo atendimento;</li>
                    <li>Os valores pagos deverão ser restituídos, conforme a legislação aplicável;</li>
                    <li>O exercício desse direito não poderá gerar custos adicionais ao consumidor.</li>
                </ul>

                <h4>2. Trocas por tamanho, cor ou modelo</h4>
                <p>Caso o cliente deseje trocar um produto por motivo de tamanho, cor ou preferência pessoal, a solicitação deverá ser realizada conforme as condições de troca voluntária oferecidas pela Belutti, sem prejuízo do direito legal de arrependimento.</p>
                <p><strong>Prazo para solicitar a troca voluntária:</strong> até 7 (sete) dias corridos após o recebimento do produto.</p>
                <p>Para solicitar a troca, o cliente deverá entrar em contato com nosso atendimento, informando o número do pedido e o motivo da solicitação.</p>
                <p>A possibilidade de troca estará sujeita à disponibilidade do produto desejado.</p>

                <h4>3. Produtos com defeito</h4>
                <p>Caso o produto apresente algum defeito, o cliente deverá entrar em contato com a Belutti para informar o ocorrido.</p>
                <p>A solicitação será analisada conforme as regras do Código de Defesa do Consumidor.</p>
                <p>Nos termos da legislação, os fornecedores possuem, em regra, até 30 dias para sanar o vício do produto. Caso o problema não seja resolvido nesse prazo, o consumidor poderá escolher entre as alternativas previstas em lei, como:</p>
                <ul>
                    <li>Substituição do produto por outro da mesma espécie, em perfeitas condições de uso;</li>
                    <li>Restituição da quantia paga;</li>
                    <li>Abatimento proporcional do preço.</li>
                </ul>
                <p>Os prazos legais para reclamar de vícios aparentes ou de fácil constatação são de 30 dias para produtos não duráveis e 90 dias para produtos duráveis, contados a partir da entrega, conforme o Código de Defesa do Consumidor.</p>

                <h4>4. Produto diferente do pedido</h4>
                <p>Se o cliente receber um produto diferente daquele adquirido, deverá entrar em contato com a Belutti para comunicar o ocorrido.</p>
                <p>A loja irá orientar sobre os procedimentos necessários para solucionar o problema, respeitando os direitos do consumidor.</p>

                <h4>5. Condições para solicitação</h4>
                <p>Para facilitar a identificação e o atendimento da solicitação, recomendamos que o cliente:</p>
                <ul>
                    <li>Informe o número do pedido;</li>
                    <li>Informe o nome utilizado na compra;</li>
                    <li>Descreva o motivo da solicitação;</li>
                    <li>Envie fotografias do produto, quando necessário para compreender o problema.</li>
                </ul>
                <p>Essas informações auxiliam na análise e no encaminhamento da solicitação.</p>
                <p>As condições de conservação e devolução do produto deverão respeitar a legislação aplicável, inclusive o direito de examinar o item recebido.</p>

                <h4>6. Reembolso</h4>
                <p>Quando houver direito à restituição dos valores, o procedimento será realizado conforme a forma de pagamento utilizada na compra e as regras aplicáveis.</p>
                <p>Em pagamentos realizados por cartão, o estorno será solicitado à administradora ou instituição responsável, observados os prazos operacionais correspondentes.</p>
                <p>Em pagamentos realizados por Pix ou outras modalidades, a Belutti orientará o cliente sobre o procedimento de restituição.</p>

                <h4>7. Custos de envio</h4>
                <p>Nos casos de exercício do direito de arrependimento dentro do prazo legal, bem como nas situações em que a devolução decorrer de problema pelo qual a loja seja responsável, o consumidor não deverá arcar com os custos de devolução.</p>
                <p>Nas trocas voluntárias por preferência pessoal, fora do prazo legal de arrependimento, as condições de envio serão informadas previamente ao cliente, conforme a política adotada pela Belutti.</p>

                <h4>8. Como solicitar uma troca ou devolução?</h4>
                <p>Para iniciar uma solicitação, o cliente deverá entrar em contato por um dos canais oficiais:</p>
                <p>
                    <strong>WhatsApp:</strong> +55 81 9862-4510<br>
                    <strong>E-mail:</strong> bltbelutti@gmail.com
                </p>
                <p>No contato, informe:</p>
                <ol style="padding-left: 20px; margin-bottom: 15px;">
                    <li style="margin-bottom: 6px;">Nome completo;</li>
                    <li style="margin-bottom: 6px;">Número do pedido;</li>
                    <li style="margin-bottom: 6px;">Produto adquirido;</li>
                    <li style="margin-bottom: 6px;">Motivo da solicitação.</li>
                </ol>
                <p>Após o recebimento da mensagem, a equipe da Belutti fornecerá as orientações necessárias para dar continuidade ao atendimento.</p>

                <h4>9. Disposições finais</h4>
                <p>Esta política busca apresentar de forma clara os procedimentos de troca e devolução da Belutti, sem limitar ou substituir os direitos garantidos pelo Código de Defesa do Consumidor e demais normas aplicáveis.</p>
                <p>Em caso de dúvidas, nossa equipe estará disponível pelos canais oficiais de atendimento.</p>
                <p><strong>Belutti — Vista seu estilo!</strong></p>
            `
        },
        'prazos': {
            titulo: 'Prazos de Entrega',
            conteudo: '<p>Os nossos prazos variam de acordo com a sua região e a modalidade de frete escolhida no momento da compra.</p>'
        },
        'faq': {
            titulo: 'Perguntas Frequentes (FAQ)',
            conteudo: '<p><strong>Como rastreio o meu pedido?</strong><br>Você receberá um código de rastreio no seu e-mail assim que o pedido for despachado.</p>'
        },
        'privacidade': {
            titulo: 'Política de Privacidade e Proteção de Dados',
            conteudo: `
                <p><strong>Última atualização: 12 de novembro de 2026</strong></p>
                <p>A Belutti valoriza a privacidade e a segurança das informações de seus clientes. Esta Política de Privacidade explica como os dados pessoais são coletados, utilizados, armazenados e protegidos durante a navegação e a realização de compras em nosso site.</p>
                <p>Nosso compromisso é tratar as informações com responsabilidade e transparência, respeitando a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).</p>

                <h4>1. Quais dados coletamos?</h4>
                <p>Podemos coletar os seguintes dados, conforme a interação do cliente com nosso site:</p>
                <ul>
                    <li><strong>Dados de identificação:</strong> nome completo e CPF, quando necessário.</li>
                    <li><strong>Dados de contato:</strong> telefone, e-mail e endereço.</li>
                    <li><strong>Dados de compra:</strong> produtos adquiridos, pedidos, valores e informações necessárias para o processamento do pagamento.</li>
                    <li><strong>Dados de navegação:</strong> informações sobre o acesso ao site, como páginas visitadas, dispositivo utilizado e cookies, quando aplicável.</li>
                </ul>
                <p>A Belutti busca coletar apenas as informações necessárias para realizar suas atividades e atender às solicitações dos clientes.</p>

                <h4>2. Para que utilizamos seus dados?</h4>
                <p>As informações coletadas podem ser utilizadas para:</p>
                <ul>
                    <li>Processar e confirmar pedidos;</li>
                    <li>Realizar pagamentos e emitir documentos relacionados à compra;</li>
                    <li>Organizar entregas e acompanhar pedidos;</li>
                    <li>Entrar em contato com o cliente sobre compras, dúvidas ou solicitações;</li>
                    <li>Prestar atendimento e solucionar problemas;</li>
                    <li>Melhorar a experiência de navegação e o funcionamento do site;</li>
                    <li>Enviar novidades, ofertas e comunicações promocionais, quando autorizado ou quando houver outra base legal aplicável.</li>
                </ul>

                <h4>3. Compartilhamento de informações</h4>
                <p>A Belutti não comercializa os dados pessoais de seus clientes.</p>
                <p>Algumas informações poderão ser compartilhadas com empresas que auxiliam na operação da loja, como prestadores de serviços de pagamento, transportadoras, serviços de hospedagem e ferramentas tecnológicas, quando necessário para realizar uma compra ou manter o funcionamento do site.</p>
                <p>Esse compartilhamento deve ocorrer somente na medida necessária para a finalidade informada e com os cuidados adequados de proteção dos dados.</p>

                <h4>4. Cookies e tecnologias de navegação</h4>
                <p>Nosso site poderá utilizar cookies e tecnologias semelhantes para melhorar a navegação, lembrar preferências e compreender como os visitantes utilizam a página.</p>
                <p>Cookies necessários ao funcionamento do site podem ser utilizados para viabilizar suas funcionalidades. Já os cookies não essenciais, como os utilizados para publicidade ou análise de comportamento, deverão respeitar as escolhas do visitante e, quando exigido, dependerão de seu consentimento.</p>
                <p>O cliente poderá gerenciar suas preferências por meio das configurações disponibilizadas no site e também do navegador utilizado.</p>

                <h4>5. Armazenamento e segurança dos dados</h4>
                <p>A Belutti adota medidas de segurança adequadas para proteger as informações contra acessos não autorizados, perdas, alterações ou divulgações indevidas.</p>
                <p>Os dados serão armazenados pelo período necessário para cumprir as finalidades para as quais foram coletados, respeitando as obrigações legais e regulatórias aplicáveis.</p>
                <p>Quando não forem mais necessários, os dados poderão ser eliminados, anonimizados ou mantidos nas hipóteses permitidas pela legislação.</p>

                <h4>6. Direitos dos titulares dos dados</h4>
                <p>De acordo com a LGPD, o cliente poderá solicitar, conforme as condições previstas na legislação:</p>
                <ul>
                    <li>Confirmação da existência de tratamento de seus dados;</li>
                    <li>Acesso às informações pessoais armazenadas;</li>
                    <li>Correção de dados incompletos, incorretos ou desatualizados;</li>
                    <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados irregularmente;</li>
                    <li>Informações sobre o compartilhamento de seus dados;</li>
                    <li>Revogação do consentimento, quando o tratamento estiver baseado nele;</li>
                    <li>Eliminação dos dados tratados com consentimento, observadas as exceções legais.</li>
                </ul>
                <p>Algumas informações poderão precisar ser mantidas para cumprimento de obrigações legais, regulatórias ou para o exercício regular de direitos.</p>

                <h4>7. Comunicações e ofertas</h4>
                <p>O envio de mensagens promocionais, novidades e ofertas será realizado de acordo com a legislação aplicável.</p>
                <p>Quando o envio depender de consentimento, o cliente poderá escolher se deseja receber essas comunicações e poderá cancelar sua inscrição a qualquer momento por meio do canal disponibilizado pela Belutti.</p>

                <h4>8. Alterações nesta política</h4>
                <p>Esta Política de Privacidade poderá ser atualizada para refletir mudanças nas atividades da loja, nas funcionalidades do site ou na legislação aplicável.</p>
                <p>Recomendamos que o cliente consulte esta página periodicamente para acompanhar eventuais alterações.</p>

                <h4>9. Contato</h4>
                <p>Para esclarecer dúvidas, solicitar informações ou exercer seus direitos relacionados à proteção de dados pessoais, entre em contato conosco:</p>
                <p>
                    <strong>Loja:</strong> Belutti<br>
                    <strong>E-mail:</strong> bltbelutti@gmail.com<br>
                    <strong>WhatsApp:</strong> +55 81 9862-4510
                </p>
                <p>A Belutti permanece à disposição para atender às solicitações relacionadas à privacidade e à proteção de dados.</p>
            `
        },
        'termos': {
            titulo: 'Termos de Uso',
            conteudo: `
                <p><strong>Última atualização: 12 de novembro de 2026</strong></p>
                <p>Seja bem-vindo à Belutti!</p>
                <p>Estes Termos de Uso estabelecem as condições para acesso, navegação e realização de compras em nosso site. Ao utilizar a página, o cliente declara estar ciente das condições apresentadas neste documento.</p>
                <p>Recomendamos a leitura antes de realizar qualquer compra.</p>

                <h4>1. Sobre a Belutti</h4>
                <p>A Belutti é uma loja de moda masculina que busca oferecer produtos que valorizam o estilo, a personalidade e a autenticidade de cada cliente.</p>
                <p>Por meio de nosso site, disponibilizamos produtos para consulta e compra, conforme as condições de disponibilidade, pagamento e entrega apresentadas em cada oferta.</p>
                <p><strong>Identificação da loja:</strong></p>
                <ul>
                    <li><strong>Nome:</strong> Belutti</li>
                    <li><strong>E-mail:</strong> bltbelutti@gmail.com</li>
                    <li><strong>WhatsApp:</strong> +55 81 9862-4510</li>
                </ul>

                <h4>2. Navegação e informações do cliente</h4>
                <p>O cliente compromete-se a fornecer informações verdadeiras, completas e atualizadas ao realizar uma compra ou preencher qualquer formulário disponível no site.</p>
                <p>A Belutti não se responsabiliza por problemas decorrentes de informações incorretas fornecidas pelo próprio cliente, como endereço de entrega incompleto ou número de contato inválido.</p>
                <p>O tratamento das informações pessoais seguirá as condições descritas em nossa Política de Privacidade e Proteção de Dados.</p>

                <h4>3. Produtos e disponibilidade</h4>
                <p>A Belutti busca apresentar imagens, descrições, tamanhos, cores e demais características dos produtos de forma clara e fiel.</p>
                <p>As imagens são utilizadas para representar os produtos, podendo existir pequenas variações de tonalidade em razão da iluminação, fotografia ou configuração da tela do dispositivo utilizado pelo cliente.</p>
                <p>A disponibilidade dos produtos poderá sofrer alterações conforme o estoque.</p>
                <p>Caso ocorra alguma indisponibilidade após a realização de um pedido, o cliente será informado e receberá as orientações sobre as alternativas disponíveis.</p>

                <h4>4. Preços e formas de pagamento</h4>
                <p>Os preços dos produtos serão apresentados no site e poderão sofrer alterações sem aviso prévio, respeitando as condições de ofertas e pedidos já confirmados.</p>
                <p>As formas de pagamento disponíveis serão informadas durante o processo de compra.</p>
                <p>A confirmação do pedido dependerá da aprovação do pagamento, quando aplicável.</p>
                <p>O cliente deverá conferir os valores, os produtos selecionados e as informações da compra antes de finalizar o pedido.</p>

                <h4>5. Pedidos e confirmação da compra</h4>
                <p>Após a finalização do pedido, o cliente receberá uma confirmação pelo canal de contato informado durante a compra.</p>
                <p>A Belutti poderá entrar em contato para confirmar informações necessárias ao processamento do pedido.</p>
                <p>A confirmação da compra não elimina a responsabilidade da loja de cumprir as condições da oferta, incluindo produto, quantidade, preço e prazo de entrega informados.</p>

                <h4>6. Entrega e envio</h4>
                <p>As condições de entrega, os valores de frete e os prazos estimados serão apresentados durante o processo de compra, conforme a modalidade e a região de destino.</p>
                <p>O cliente deverá fornecer corretamente os dados de entrega.</p>
                <p>Após o envio, poderão ser disponibilizadas informações de rastreamento, quando o serviço contratado oferecer essa funcionalidade.</p>
                <p>Em caso de dúvidas ou problemas relacionados à entrega, o cliente poderá entrar em contato com nosso atendimento.</p>

                <h4>7. Trocas, devoluções e cancelamentos</h4>
                <p>As solicitações de troca, devolução ou cancelamento deverão seguir as condições descritas em nossa Política de Trocas e Devoluções.</p>
                <p>Nas compras realizadas pela internet, o consumidor possui o direito de arrependimento previsto no artigo 49 do Código de Defesa do Consumidor, respeitando o prazo e as condições legais.</p>
                <p>A Belutti respeita os direitos dos consumidores e disponibiliza canais de atendimento para essas solicitações.</p>

                <h4>8. Responsabilidades</h4>
                <p>A Belutti compromete-se a apresentar informações claras sobre seus produtos, respeitar as condições das ofertas e prestar atendimento aos clientes.</p>
                <p>O cliente compromete-se a utilizar o site de maneira adequada, fornecer informações corretas e não praticar ações que prejudiquem o funcionamento, a segurança ou a integridade da página.</p>

                <h4>9. Propriedade intelectual</h4>
                <p>Os elementos presentes no site, incluindo nome Belutti, logotipo, fotografias, textos, identidade visual e demais conteúdos, são protegidos pela legislação aplicável.</p>
                <p>Não é permitida a reprodução ou utilização desses materiais para fins comerciais sem autorização prévia dos responsáveis.</p>

                <h4>10. Atualizações dos Termos de Uso</h4>
                <p>A Belutti poderá atualizar estes Termos de Uso sempre que necessário, buscando manter as informações claras e adequadas às atividades da loja e à legislação vigente.</p>
                <p>As alterações serão disponibilizadas nesta página, acompanhadas da data de atualização.</p>

                <h4>11. Atendimento</h4>
                <p>Em caso de dúvidas, reclamações ou solicitações, entre em contato pelos canais oficiais:</p>
                <p>
                    <strong>E-mail:</strong> bltbelutti@gmail.com<br>
                    <strong>WhatsApp:</strong> +55 81 9862-4510<br>
                    <strong>Horário de atendimento:</strong><br>
                    SEG à SAB: 09 às 20hrs<br>
                    DOM: 08 às 13hrs
                </p>
                <p>Agradecemos por escolher a Belutti. Vista seu estilo!</p>
            `
        },
    };

    if (sidebarPanel && sidebarOverlay) {
        openSidebarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-target');
                if (dadosPainel[target]) {
                    sidebarTitle.textContent = dadosPainel[target].titulo;
                    sidebarContent.innerHTML = dadosPainel[target].conteudo;
                    sidebarOverlay.classList.add('active');
                    sidebarPanel.classList.add('active');
                }
            });
        });

        const fecharPainel = () => {
            sidebarOverlay.classList.remove('active');
            sidebarPanel.classList.remove('active');
        };

        if (sidebarClose) sidebarClose.addEventListener('click', fecharPainel);
        sidebarOverlay.addEventListener('click', fecharPainel);
    }

    /* =========================================
       2. SISTEMA DE FILTROS (CORES, PREÇO E MODELAGEM)
    ========================================= */
    const sliderMin = document.getElementById('slider-min');
    const sliderMax = document.getElementById('slider-max');
    const displayMin = document.getElementById('price-min-val');
    const displayMax = document.getElementById('price-max-val');
    const track = document.querySelector('.slider-track');

    const colorItems = document.querySelectorAll('.color-item');
    const modelagemCheckboxes = document.querySelectorAll('.modelagem-checkbox');
    const resultCount = document.getElementById('resultado-count');
    const gridProdutos = document.getElementById('productGrid');

    let corAtiva = null;

    function atualizarSlider() {
        if (!sliderMin || !sliderMax) return;

        let minVal = parseInt(sliderMin.value);
        let maxVal = parseInt(sliderMax.value);
        const maxLimit = parseInt(sliderMax.max);

        if (maxVal - minVal < 10) {
            if (this && this.id === 'slider-min') sliderMin.value = maxVal - 10;
            else sliderMax.value = minVal + 10;
            minVal = parseInt(sliderMin.value);
            maxVal = parseInt(sliderMax.value);
        }

        if (displayMin) displayMin.textContent = `R$ ${minVal}`;
        if (displayMax) displayMax.textContent = `R$ ${maxVal}`;

        const percentMin = (minVal / maxLimit) * 100;
        const percentMax = (maxVal / maxLimit) * 100;
        if (track) {
            track.style.left = percentMin + "%";
            track.style.right = (100 - percentMax) + "%";
        }
        window.filtrarProdutos();
    }

    if (sliderMin && sliderMax) {
        sliderMin.addEventListener('input', atualizarSlider);
        sliderMax.addEventListener('input', atualizarSlider);
    }

    colorItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                corAtiva = null;
            } else {
                colorItems.forEach(c => c.classList.remove('active'));
                item.classList.add('active');
                corAtiva = item.getAttribute('data-cor');
            }
            window.filtrarProdutos();
        });
    });

    modelagemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => window.filtrarProdutos());
    });

    window.filtrarProdutos = function () {
        const produtos = document.querySelectorAll('.product-card');
        if (!sliderMin || !sliderMax) return;

        const precoMin = parseInt(sliderMin.value);
        const precoMax = parseInt(sliderMax.value);

        const modelagensMarcadas = Array.from(modelagemCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let visiveis = 0;

        produtos.forEach(produto => {
            const precoProduto = parseFloat(produto.getAttribute('data-preco'));
            const corProduto = produto.getAttribute('data-cor');
            const modelagemProduto = produto.getAttribute('data-modelagem');

            const passaPreco = precoProduto >= precoMin && precoProduto <= precoMax;
            const passaCor = corAtiva === null || corAtiva === corProduto;
            const passaModelagem = modelagensMarcadas.length === 0 || modelagensMarcadas.includes(modelagemProduto);

            if (passaPreco && passaCor && passaModelagem) {
                produto.style.display = 'flex';
                visiveis++;
            } else {
                produto.style.display = 'none';
            }
        });

        if (resultCount) {
            resultCount.textContent = `Exibindo: ${visiveis} resultado${visiveis !== 1 ? 's' : ''}`;
        }
    };

    // Sincroniza automaticamente quando o catalog.js renderiza os produtos vindos do banco
    if (gridProdutos && sliderMin && sliderMax) {
        const gridObserver = new MutationObserver(() => {
            window.filtrarProdutos();
        });
        gridObserver.observe(gridProdutos, { childList: true });
    }

    /* =========================================
       3. RECOLHER/EXPANDIR FILTROS (SETINHAS)
    ========================================= */
    const filterToggles = document.querySelectorAll('.filter-toggle');
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const group = toggle.closest('.filter-group');
            if (group) group.classList.toggle('collapsed');
        });
    });

    /* =========================================
       4. ORDENAÇÃO DE PRODUTOS (MENOR/MAIOR PREÇO)
    ========================================= */
    const sortSelect = document.getElementById('ordenar-produtos');

    if (sortSelect && gridProdutos) {
        sortSelect.addEventListener('change', () => {
            const listaProdutos = Array.from(document.querySelectorAll('.product-grid .product-card'));
            const valor = sortSelect.value;
            let produtosReordenados = [...listaProdutos];

            if (valor === 'menor') {
                produtosReordenados.sort((a, b) => parseFloat(a.getAttribute('data-preco')) - parseFloat(b.getAttribute('data-preco')));
            } else if (valor === 'maior') {
                produtosReordenados.sort((a, b) => parseFloat(b.getAttribute('data-preco')) - parseFloat(a.getAttribute('data-preco')));
            } else {
                produtosReordenados.sort((a, b) => (parseInt(a.getAttribute('data-id')) || 0) - (parseInt(b.getAttribute('data-id')) || 0));
            }

            gridProdutos.innerHTML = '';
            produtosReordenados.forEach(produto => {
                gridProdutos.appendChild(produto);
            });
            window.filtrarProdutos();
        });
    }
});