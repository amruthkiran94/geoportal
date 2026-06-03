import { makeObservable, observable, action } from "mobx";
import type Terria from "terriajs/lib/Models/Terria";
import type ViewState from "terriajs/lib/ReactViewModels/ViewState";
import { initKeycloak, hasAccessRole } from "../auth/keycloak";

class TerriaStore {
  terria: Terria | undefined = undefined;
  viewState: ViewState | undefined = undefined;
  status: "loading" | "ready" | "access-denied" = "loading";

  constructor() {
    makeObservable(this, {
      terria: observable,
      viewState: observable,
      status: observable,
      setReady: action,
      setAccessDenied: action
    });

    this.init();
  }

  async init() {
    // 1. Authenticate — redirects to Keycloak login if not already signed in.
    //    Resolves only once the user is authenticated and redirected back.
    await initKeycloak();

    // 2. Check the user has the required realm role.
    if (!hasAccessRole()) {
      this.setAccessDenied();
      return;
    }

    // 3. Load TerriaJS prerequisites then start Terria.
    //@ts-expect-error: need to convert to TS
    await import("terriajs/lib/Core/prerequisites");

    const { terria, viewState } = await import("../../index.js").then(
      (module) => module.default
    );

    this.setReady(terria, viewState);
  }

  setReady(terria: Terria, viewState: ViewState) {
    this.terria = terria;
    this.viewState = viewState;
    this.status = "ready";
  }

  setAccessDenied() {
    this.status = "access-denied";
  }
}

export const terriaStore = new TerriaStore();
