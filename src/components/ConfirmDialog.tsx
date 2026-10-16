import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Fenêtre de confirmation réutilisable, basée sur l'élément natif <dialog> :
// focus piégé, fermeture avec Échap et lecteurs d'écran gérés par le navigateur.
export default function ConfirmDialog({ open, title, children, confirmLabel = "Confirmer", onConfirm, onCancel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus(); // action la plus sûre sélectionnée par défaut
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(e) => { e.preventDefault(); onCancel(); }} // touche Échap
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }} // clic sur le fond
    >
      <div className="dialog-body">
        <h2 id="dialog-title">{title}</h2>
        <div className="dialog-text">{children}</div>
        <div className="actions dialog-actions">
          <button ref={cancelRef} type="button" className="btn secondary" onClick={onCancel}>Annuler</button>
          <button type="button" className="btn danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </dialog>
  );
}
