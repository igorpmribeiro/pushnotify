interface NotificationStatusProps {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | 'default';
  error: string | null;
}

export function NotificationStatus({
  isSupported,
  isSubscribed,
  permission,
  error,
}: NotificationStatusProps) {
  if (!isSupported) {
    return (
      <div className="status status--error">
        Seu navegador nao suporta notificacoes push.
      </div>
    );
  }

  if (error) {
    return <div className="status status--error">{error}</div>;
  }

  if (permission === 'denied') {
    return (
      <div className="status status--error">
        Notificacoes bloqueadas pelo navegador. Altere nas configuracoes do seu navegador.
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="status status--success">
        Voce esta recebendo notificacoes de novos produtos!
      </div>
    );
  }

  return (
    <div className="status status--info">
      Ative as notificacoes para saber sobre novos produtos em primeira mao.
    </div>
  );
}
