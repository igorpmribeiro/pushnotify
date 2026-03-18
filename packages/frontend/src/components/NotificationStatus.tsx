interface NotificationStatusProps {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | 'default';
  error: string | null;
}

function StatusIcon({ type }: { type: 'success' | 'error' | 'info' }) {
  const paths: Record<string, string> = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    error: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z',
    info: 'M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z',
  };

  return (
    <svg
      className="status__icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[type]} />
    </svg>
  );
}

export function NotificationStatus({
  isSupported,
  isSubscribed,
  permission,
  error,
}: NotificationStatusProps) {
  if (!isSupported) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
      <div className="status status--error" role="alert">
        <StatusIcon type="error" />
        <span>
          {isIOS
            ? 'No iOS, notificacoes push so funcionam pelo Safari. Abra este site no Safari, toque em "Compartilhar" e depois em "Adicionar a Tela de Inicio". Ao abrir o app pela tela inicial, as notificacoes estarao disponiveis.'
            : 'Seu navegador nao suporta notificacoes push. Tente usar um navegador mais recente como Chrome, Firefox ou Edge.'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status status--error" role="alert">
        <StatusIcon type="error" />
        <span>{error}</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="status status--error" role="alert">
        <StatusIcon type="error" />
        <span>
          Notificacoes bloqueadas. Acesse as configuracoes do navegador, procure
          por este site e altere a permissao de notificacoes para "Permitir".
        </span>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="status status--success" role="status">
        <StatusIcon type="success" />
        <span>Tudo certo! Voce recebera avisos de novos produtos da Rufer.</span>
      </div>
    );
  }

  return (
    <div className="status status--info" role="status">
      <StatusIcon type="info" />
      <span>Ative as notificacoes para saber sobre novos produtos em primeira mao.</span>
    </div>
  );
}
