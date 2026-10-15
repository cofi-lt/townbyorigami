import { PhoneIcon } from "../Icons";

type FloatingCallWidgetProps = {
  openModal: () => void;
  label?: string;
};

export function FloatingCallWidget({ openModal, label: propLabel }: FloatingCallWidgetProps) {
  const label = propLabel?.trim();
  if (!label) return null;

  return (
    <aside className="floating-call-widget" aria-label={label}>
      <button
        type="button"
        className="floating-call-widget-btn"
        aria-label={label}
        onClick={openModal}
      >
        <span className="floating-call-widget-pulse" aria-hidden="true" />
        <span className="floating-call-widget-icon" aria-hidden="true">
          <PhoneIcon />
        </span>
        <span className="floating-call-widget-text">{label}</span>
      </button>
    </aside>
  );
}
