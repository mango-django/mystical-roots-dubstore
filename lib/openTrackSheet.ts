export function openTrackSheet(track: {
  title: string;
  artist: string;
  format: string;
  price: number;
  previewUrl?: string;
}) {
  document.dispatchEvent(
    new CustomEvent("open-track-sheet", { detail: track })
  );
}
