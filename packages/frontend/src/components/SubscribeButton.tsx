interface SubscribeButtonProps {
  isSubscribed: boolean;
  loading: boolean;
  disabled: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

export function SubscribeButton({
  isSubscribed,
  loading,
  disabled,
  onSubscribe,
  onUnsubscribe,
}: SubscribeButtonProps) {
  if (isSubscribed) {
    return (
      <button
        className="btn btn--secondary"
        onClick={onUnsubscribe}
        disabled={loading}
      >
        {loading && <span className="btn__spinner" aria-hidden="true" />}
        {loading ? 'Processando...' : 'Desativar Notificacoes'}
      </button>
    );
  }

  return (
    <button
      className="btn btn--primary"
      onClick={onSubscribe}
      disabled={loading || disabled}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {loading ? 'Processando...' : 'Ativar Notificacoes'}
    </button>
  );
}
