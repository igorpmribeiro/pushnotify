import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <div className="header__logo" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <h1 className="header__title">
          <span className="header__title-accent">Rufer</span>
        </h1>
        <p className="header__subtitle">
          Fique por dentro das novidades da nossa loja
        </p>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Rufer</p>
      </footer>
    </div>
  );
}
