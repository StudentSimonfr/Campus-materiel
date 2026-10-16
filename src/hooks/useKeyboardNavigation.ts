import { useEffect } from "react";

// Navigation au clavier : les flèches déplacent le focus vers l'élément interactif
// le plus proche dans la direction choisie ; la barre d'espace valide (boutons ET liens).
type Direction = "up" | "down" | "left" | "right";

const FOCUSABLE = 'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
};
const MIN_DISTANCE = 8; // ignore les éléments situés sur la même ligne/colonne

const isVisible = (el: HTMLElement) =>
  el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";

// Si une fenêtre de confirmation est ouverte, la navigation reste à l'intérieur.
function getCandidates(): HTMLElement[] {
  const root: ParentNode = document.querySelector("dialog[open]") ?? document;
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.matches(":disabled") && isVisible(el)
  );
}

const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

// Distance (principale, transversale) entre deux éléments selon la direction.
function offsets(dir: Direction, dx: number, dy: number): [number, number] {
  if (dir === "down") return [dy, dx];
  if (dir === "up") return [-dy, dx];
  if (dir === "right") return [dx, dy];
  return [-dx, dy];
}

function findNext(current: HTMLElement, dir: Direction, candidates: HTMLElement[]): HTMLElement | null {
  const from = center(current.getBoundingClientRect());
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of candidates) {
    if (el === current) continue;
    const to = center(el.getBoundingClientRect());
    const [main, cross] = offsets(dir, to.x - from.x, to.y - from.y);
    if (main <= MIN_DISTANCE) continue; // pas dans la bonne direction
    const score = main + 2 * Math.abs(cross); // on préfère rester aligné
    if (score < bestScore) { best = el; bestScore = score; }
  }
  return best;
}

export function useKeyboardNavigation(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
      const target = e.target as HTMLElement;

      // Barre d'espace : valide un lien (les boutons le font déjà nativement)
      if (e.key === " " && target instanceof HTMLAnchorElement && target.hasAttribute("href")) {
        e.preventDefault();
        if (!e.repeat) target.click();
        return;
      }

      const dir = KEY_TO_DIRECTION[e.key];
      if (!dir) return;
      const isSelect = target instanceof HTMLSelectElement;
      // Zone de texte : comportement natif. Champ de saisie : ← → déplacent le curseur.
      if (target instanceof HTMLTextAreaElement) return;
      if (target instanceof HTMLInputElement && (dir === "left" || dir === "right")) return;
      // Liste déroulante : ↑ ↓ changent l'option (natif) ; ← → servent à en sortir.
      if (isSelect && (dir === "up" || dir === "down")) return;

      const candidates = getCandidates();
      if (candidates.length === 0) return;
      const active = document.activeElement;
      const current = active instanceof HTMLElement && candidates.includes(active) ? active : null;

      let next = current
        ? findNext(current, dir, candidates)
        : dir === "up" || dir === "left" ? candidates[candidates.length - 1] : candidates[0];

      // Depuis une liste déroulante, s'il n'y a rien dans cette direction : élément suivant/précédent
      if (!next && isSelect && current) {
        next = candidates[candidates.indexOf(current) + (dir === "right" ? 1 : -1)] ?? null;
      }

      if (isSelect) e.preventDefault(); // ← → ne doivent jamais changer l'option sélectionnée
      if (next) { e.preventDefault(); next.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
