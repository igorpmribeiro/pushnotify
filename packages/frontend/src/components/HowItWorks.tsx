const steps = [
  {
    number: '1',
    title: 'Clique em "Ativar Notificacoes"',
    description: 'Toque no botao verde acima para comecar.',
  },
  {
    number: '2',
    title: 'Permita no navegador',
    description:
      'Uma janela vai aparecer pedindo permissao. Clique em "Permitir".',
  },
  {
    number: '3',
    title: 'Pronto!',
    description:
      'Voce recebera um alerta sempre que um novo produto chegar na Rufer.',
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works">
      <h3 className="how-it-works__title">Como funciona?</h3>
      <ol className="steps">
        {steps.map((step) => (
          <li key={step.number} className="step">
            <span className="step__number" aria-hidden="true">
              {step.number}
            </span>
            <div className="step__content">
              <strong className="step__title">{step.title}</strong>
              <p className="step__description">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
