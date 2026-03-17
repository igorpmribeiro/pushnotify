import { Layout } from './components/Layout';
import { SubscribeButton } from './components/SubscribeButton';
import { NotificationStatus } from './components/NotificationStatus';
import { HowItWorks } from './components/HowItWorks';
import { usePushSubscription } from './hooks/usePushSubscription';

export function App() {
  const {
    isSupported,
    isSubscribed,
    permission,
    loading,
    error,
    subscribe,
    unsubscribe,
  } = usePushSubscription();

  return (
    <Layout>
      <section className="card">
        <h2 className="card__title">Receba novidades em primeira mao</h2>
        <p className="card__description">
          Ative as notificacoes e seja o primeiro a saber quando novos produtos
          chegarem na Rufer. Sem spam, sem e-mail — direto no seu navegador.
        </p>

        <NotificationStatus
          isSupported={isSupported}
          isSubscribed={isSubscribed}
          permission={permission}
          error={error}
        />

        <SubscribeButton
          isSubscribed={isSubscribed}
          loading={loading}
          disabled={!isSupported || permission === 'denied'}
          onSubscribe={subscribe}
          onUnsubscribe={unsubscribe}
        />
      </section>

      {!isSubscribed && isSupported && permission !== 'denied' && (
        <HowItWorks />
      )}
    </Layout>
  );
}
