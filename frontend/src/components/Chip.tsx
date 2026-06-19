interface Props {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-label-md transition-colors ${
        active
          ? "bg-on-surface text-background font-bold"
          : "bg-surface-container-highest hover:bg-surface-container text-on-surface"
      }`}
    >
      {label}
    </button>
  );
}
