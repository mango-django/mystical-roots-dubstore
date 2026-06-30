// A track, or a grouped release that carries multiple `mixes`.
// When `mixes` is present the sheet shows a version selector.
export function openTrackSheet(track: any) {
  document.dispatchEvent(
    new CustomEvent("open-track-sheet", { detail: track })
  );
}
