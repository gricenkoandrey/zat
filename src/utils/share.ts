import { DateInvitation, DEFAULT_INVITATION } from '../types/invitation';

export function encodeInvitationToUrl(invitation: DateInvitation): string {
  try {
    const jsonStr = JSON.stringify(invitation);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `invite=${encoded}`;
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeInvitationFromUrl(): DateInvitation | null {
  try {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (!hash.includes('invite=')) return null;

    const encoded = hash.split('invite=')[1]?.split('&')[0];
    if (!encoded) return null;

    const jsonStr = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(jsonStr);

    return {
      ...DEFAULT_INVITATION,
      ...parsed,
    };
  } catch {
    return null;
  }
}
