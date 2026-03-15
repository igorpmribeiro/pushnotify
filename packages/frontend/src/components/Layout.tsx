import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <h1 className="header__title">PushNotify</h1>
        <p className="header__subtitle">Novidades da loja direto no seu navegador</p>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} PushNotify</p>
      </footer>
    </div>
  );
}
