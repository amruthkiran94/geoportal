import Keycloak from "keycloak-js";

export const ACCESS_ROLE = "app-geoportal-access";

const isDev = process.env.NODE_ENV === "development";

export const keycloak = new Keycloak({
  url: "https://login.gis.iihs.co.in",
  realm: "iihs-gsl",
  clientId: "app-geoportal"
});

export async function initKeycloak(): Promise<boolean> {
  return keycloak.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false
  });
}

export function hasAccessRole(): boolean {
  return (
    keycloak.tokenParsed?.realm_access?.roles?.includes(ACCESS_ROLE) ?? false
  );
}

export function getUserDisplayName(): string {
  const t = keycloak.tokenParsed;
  if (!t) return "";
  // name > preferred_username > email — whichever is populated first
  return (
    (t as Record<string, string>)["name"] ||
    (t as Record<string, string>)["preferred_username"] ||
    (t as Record<string, string>)["email"] ||
    ""
  );
}

export function doLogout(): void {
  const redirectUri = isDev
    ? window.location.origin + window.location.pathname
    : "https://gis.iihs.co.in/";
  keycloak.logout({ redirectUri });
}
