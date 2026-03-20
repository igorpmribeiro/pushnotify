import type { ReactNode } from 'react';

interface PhoneMockupProps {
  children: ReactNode;
  caption: string;
  tall?: boolean;
}

function PhoneMockup({ children, caption, tall }: PhoneMockupProps) {
  return (
    <>
      <div className="ios-phone">
        <div className="ios-phone__frame">
          <div className="ios-phone__notch" />
          <div className={`ios-phone__screen${tall ? ' ios-phone__screen--tall' : ''}`}>
            {children}
          </div>
        </div>
      </div>
      <p className="ios-guide__caption">{caption}</p>
    </>
  );
}

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className={`ios-mock-status-bar${light ? ' ios-mock-status-bar--light' : ''}`}>
      <span>9:41</span>
    </div>
  );
}

export function IOSGuide() {
  return (
    <section className="ios-guide">
      {/* Header */}
      <div className="ios-guide__header">
        <div className="ios-guide__header-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <h3 className="ios-guide__title">Ativar Notificacoes no Safari</h3>
        <p className="ios-guide__subtitle">
          Guia passo a passo para receber notificacoes no seu iPhone ou iPad
        </p>
      </div>

      {/* Requirement */}
      <div className="ios-guide__requirement">
        <svg
          className="ios-guide__requirement-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <strong>Requisito: iOS 16.4 ou superior</strong>
          <p>
            As notificacoes web no Safari para iPhone/iPad estao disponiveis a partir do
            iOS 16.4. Verifique em <strong>Ajustes &rarr; Geral &rarr; Atualizacao de Software</strong>.
          </p>
        </div>
      </div>

      <p className="ios-guide__section-title">Passo a passo</p>

      <div className="ios-guide__steps">
        {/* Step 1 - Open in Safari */}
        <div className="ios-guide__step">
          <div className="ios-guide__step-number">1</div>
          <div className="ios-guide__step-body">
            <h4 className="ios-guide__step-title">Abra o site no Safari</h4>
            <p className="ios-guide__step-text">
              Acesse o site no Safari do seu iPhone ou iPad.{' '}
              <strong>Nao funciona em outros navegadores</strong> — precisa ser o Safari
              nativo da Apple.
            </p>
            <PhoneMockup caption="Abra o Safari e acesse o site">
              <StatusBar />
              <div className="ios-mock-safari-bar">
                <span className="ios-mock-safari-bar__lock">&#x1F512;</span>
                <span className="ios-mock-safari-bar__url">rufer.com.br</span>
              </div>
              <div className="ios-mock-safari-content">
                <div className="ios-mock-site-header">
                  <div className="ios-mock-site-logo">&#x1F3EA;</div>
                  <div>
                    <div className="ios-mock-site-name">Rufer</div>
                    <div className="ios-mock-site-desc">Bem-vindo!</div>
                  </div>
                </div>
                <div className="ios-mock-placeholder">
                  <div className="ios-mock-placeholder__line" style={{ width: '90%' }} />
                  <div className="ios-mock-placeholder__line" style={{ width: '75%' }} />
                  <div className="ios-mock-placeholder__line" style={{ width: '60%' }} />
                </div>
                <div className="ios-mock-btn">&#x1F514; Ativar Notificacoes</div>
              </div>
            </PhoneMockup>
          </div>
        </div>

        {/* Step 2 - Add to Home Screen */}
        <div className="ios-guide__step">
          <div className="ios-guide__step-number">2</div>
          <div className="ios-guide__step-body">
            <h4 className="ios-guide__step-title">Adicione a Tela de Inicio</h4>
            <p className="ios-guide__step-text">
              Para que as notificacoes funcionem, o site precisa ser instalado como um{' '}
              <strong>app na tela de inicio</strong>. Toque no icone de compartilhar
              (&#x2399;) na barra do Safari.
            </p>
            <PhoneMockup caption="Toque em &quot;Adicionar a Tela de Inicio&quot;" tall>
              <StatusBar />
              <div className="ios-mock-safari-bar">
                <span className="ios-mock-safari-bar__lock">&#x1F512;</span>
                <span className="ios-mock-safari-bar__url">rufer.com.br</span>
                <span className="ios-mock-safari-bar__share">&#x2399;</span>
              </div>
              <div className="ios-mock-overlay" />
              <div className="ios-mock-share-sheet">
                <div className="ios-mock-share-handle" />
                <div className="ios-mock-share-icons">
                  <div className="ios-mock-share-item">
                    <div className="ios-mock-share-item__icon">&#x1F4AC;</div>
                    <span className="ios-mock-share-item__label">Mensagem</span>
                  </div>
                  <div className="ios-mock-share-item">
                    <div className="ios-mock-share-item__icon">&#x1F4E7;</div>
                    <span className="ios-mock-share-item__label">E-mail</span>
                  </div>
                  <div className="ios-mock-share-item">
                    <div className="ios-mock-share-item__icon">&#x1F4CB;</div>
                    <span className="ios-mock-share-item__label">Copiar</span>
                  </div>
                </div>
                <div className="ios-mock-share-actions">
                  <div className="ios-mock-share-action ios-mock-share-action--highlighted">
                    <span className="ios-mock-share-action__icon">&#x1F4F2;</span>
                    <span>Adicionar a Tela de Inicio</span>
                  </div>
                  <div className="ios-mock-share-action">
                    <span className="ios-mock-share-action__icon">&#x1F4D6;</span>
                    <span>Lista de Leitura</span>
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>

        {/* Step 3 - Confirm Installation */}
        <div className="ios-guide__step">
          <div className="ios-guide__step-number">3</div>
          <div className="ios-guide__step-body">
            <h4 className="ios-guide__step-title">Confirme a instalacao</h4>
            <p className="ios-guide__step-text">
              Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito
              para confirmar. O icone do site aparecera na sua tela de inicio.
            </p>
            <PhoneMockup caption="Toque em &quot;Adicionar&quot; para confirmar">
              <StatusBar />
              <div className="ios-mock-confirm-bar">
                <span className="ios-mock-confirm-bar__cancel">Cancelar</span>
                <span className="ios-mock-confirm-bar__title">Adicionar a Tela</span>
                <span className="ios-mock-confirm-bar__add">Adicionar</span>
              </div>
              <div className="ios-mock-confirm-content">
                <div className="ios-mock-confirm-app">
                  <div className="ios-mock-confirm-app__icon">&#x1F3EA;</div>
                  <div>
                    <div className="ios-mock-confirm-app__name">Rufer</div>
                    <div className="ios-mock-confirm-app__url">rufer.com.br</div>
                  </div>
                </div>
                <div className="ios-mock-confirm-info">
                  Um icone sera adicionado a sua Tela de Inicio para que voce possa
                  acessar rapidamente este site.
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>

        {/* Step 4 - Open from Home Screen */}
        <div className="ios-guide__step">
          <div className="ios-guide__step-number">4</div>
          <div className="ios-guide__step-body">
            <h4 className="ios-guide__step-title">Abra o app instalado</h4>
            <p className="ios-guide__step-text">
              Volte a tela de inicio e toque no icone do site. E{' '}
              <strong>importante abrir pelo icone</strong>, nao pelo Safari diretamente.
            </p>
            <PhoneMockup caption="Toque no icone &quot;Rufer&quot; na tela de inicio">
              <StatusBar light />
              <div className="ios-mock-home">
                <div className="ios-mock-home__grid">
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#0071e3' }}>&#x1F4DE;</div>
                    <span className="ios-mock-app__name">Telefone</span>
                  </div>
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#2d9e5a' }}>&#x1F4AC;</div>
                    <span className="ios-mock-app__name">Mensagens</span>
                  </div>
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#f0a500' }}>&#x1F4F7;</div>
                    <span className="ios-mock-app__name">Camera</span>
                  </div>
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#e5332a' }}>&#x1F3B5;</div>
                    <span className="ios-mock-app__name">Musica</span>
                  </div>
                  <div className="ios-mock-app ios-mock-app--highlighted">
                    <div className="ios-mock-app__icon" style={{ background: '#22C55E' }}>&#x1F3EA;</div>
                    <span className="ios-mock-app__name">Rufer</span>
                    <span className="ios-mock-app__badge">Novo</span>
                  </div>
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#5856d6' }}>&#x1F4C5;</div>
                    <span className="ios-mock-app__name">Calendario</span>
                  </div>
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#007aff' }}>&#x1F5FA;&#xFE0F;</div>
                    <span className="ios-mock-app__name">Mapas</span>
                  </div>
                  <div className="ios-mock-app">
                    <div className="ios-mock-app__icon" style={{ background: '#34aadc' }}>&#x2699;&#xFE0F;</div>
                    <span className="ios-mock-app__name">Ajustes</span>
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>

        {/* Step 5 - Allow Notifications */}
        <div className="ios-guide__step">
          <div className="ios-guide__step-number">5</div>
          <div className="ios-guide__step-body">
            <h4 className="ios-guide__step-title">Permita as notificacoes</h4>
            <p className="ios-guide__step-text">
              O site pedira permissao para enviar notificacoes. Toque em{' '}
              <strong>&quot;Permitir&quot;</strong> para ativar.
            </p>
            <PhoneMockup caption="Toque em &quot;Permitir&quot; para ativar">
              <StatusBar />
              <div className="ios-mock-overlay" />
              <div className="ios-mock-dialog">
                <div className="ios-mock-dialog__body">
                  <div className="ios-mock-dialog__icon">&#x1F514;</div>
                  <h5 className="ios-mock-dialog__title">
                    &quot;Rufer&quot; quer enviar notificacoes
                  </h5>
                  <p className="ios-mock-dialog__text">
                    Notificacoes podem incluir alertas, sons e icones.
                  </p>
                </div>
                <div className="ios-mock-dialog__actions">
                  <span className="ios-mock-dialog__btn">Nao permitir</span>
                  <span className="ios-mock-dialog__btn ios-mock-dialog__btn--primary">
                    Permitir
                  </span>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>

        {/* Step 6 - Done */}
        <div className="ios-guide__step">
          <div className="ios-guide__step-number">6</div>
          <div className="ios-guide__step-body">
            <h4 className="ios-guide__step-title">Pronto! Notificacoes ativadas</h4>
            <p className="ios-guide__step-text">
              A partir de agora voce recebera as notificacoes mesmo com o app fechado.
              Elas aparecerao na tela de bloqueio e na Central de Notificacoes.
            </p>
            <PhoneMockup caption="Notificacoes aparecem na tela de bloqueio">
              <div className="ios-mock-lock">
                <StatusBar light />
                <div className="ios-mock-lock__time">
                  <div className="ios-mock-lock__date">Sabado, 15 de marco</div>
                  <div className="ios-mock-lock__clock">9:45</div>
                </div>
                <div className="ios-mock-notification">
                  <div className="ios-mock-notification__icon" style={{ background: '#22C55E' }}>
                    &#x1F3EA;
                  </div>
                  <div>
                    <div className="ios-mock-notification__app">Rufer &bull; agora</div>
                    <div className="ios-mock-notification__title">Novo produto disponivel!</div>
                    <div className="ios-mock-notification__body">
                      Confira as novidades na Rufer. Toque para ver.
                    </div>
                  </div>
                </div>
                <div className="ios-mock-notification" style={{ opacity: 0.7, marginTop: '4px' }}>
                  <div className="ios-mock-notification__icon" style={{ background: '#22C55E' }}>
                    &#x1F514;
                  </div>
                  <div>
                    <div className="ios-mock-notification__app">Rufer &bull; 2 min atras</div>
                    <div className="ios-mock-notification__title">Promocao especial!</div>
                    <div className="ios-mock-notification__body">10% de desconto hoje.</div>
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>
      </div>

      {/* Tips */}
      <p className="ios-guide__section-title">Gerenciar notificacoes depois</p>

      <div className="ios-guide__tip">
        <svg
          className="ios-guide__tip-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <div>
          <h4 className="ios-guide__tip-title">Como alterar as permissoes depois</h4>
          <p className="ios-guide__tip-text">
            Acesse <strong>Ajustes &rarr; Notificacoes</strong>, role ate encontrar o nome
            do site e ajuste as preferencias.
          </p>
        </div>
      </div>

      <div className="ios-guide__tip">
        <svg
          className="ios-guide__tip-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <div>
          <h4 className="ios-guide__tip-title">Notificacoes nao chegam?</h4>
          <p className="ios-guide__tip-text">
            Verifique se o <strong>Modo Nao Perturbe</strong> esta desativado e se as
            notificacoes do site nao foram bloqueadas em{' '}
            <strong>Ajustes &rarr; Notificacoes</strong>. Certifique-se de que voce esta
            abrindo o site pelo icone da tela de inicio, e nao pelo Safari.
          </p>
        </div>
      </div>

      {/* Success */}
      <div className="ios-guide__success">
        <svg
          className="ios-guide__success-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h4 className="ios-guide__success-title">Tudo certo!</h4>
        <p className="ios-guide__success-text">
          Seguindo esses passos voce ja consegue receber notificacoes diretamente no seu
          iPhone ou iPad, sem instalar nenhum aplicativo da App Store.
        </p>
      </div>
    </section>
  );
}
