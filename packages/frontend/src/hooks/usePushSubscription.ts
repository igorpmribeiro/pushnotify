import { useState, useEffect, useCallback } from 'react';
import { getVapidPublicKey, registerSubscription, removeSubscription } from '../services/api';
import { urlBase64ToUint8Array } from '../utils/vapid';

interface UsePushSubscriptionReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | 'default';
  loading: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushSubscription(): UsePushSubscriptionReturn {
  const [isSupported] = useState(() =>
    'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window,
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!isSupported) {
      setLoading(false);
      return;
    }

    setPermission(Notification.permission);

    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        setRegistration(reg);
        return reg.pushManager.getSubscription();
      })
      .then((sub) => {
        setIsSubscribed(sub !== null);
      })
      .catch((err) => {
        setError(`Erro ao registrar Service Worker: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!registration) return;

    setLoading(true);
    setError(null);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        setError('Permissao de notificacao negada pelo navegador.');
        return;
      }

      const publicKey = await getVapidPublicKey();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
      });

      await registerSubscription(subscription);
      setIsSubscribed(true);
    } catch (err) {
      setError(`Erro ao ativar notificacoes: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [registration]);

  const unsubscribe = useCallback(async () => {
    if (!registration) return;

    setLoading(true);
    setError(null);

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await removeSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      setError(`Erro ao desativar notificacoes: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [registration]);

  return { isSupported, isSubscribed, permission, loading, error, subscribe, unsubscribe };
}
