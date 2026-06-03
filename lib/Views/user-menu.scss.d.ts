declare namespace UserMenuScssNamespace {
  export interface IUserMenuScss {
    "sign-out-btn": string;
    signOutBtn: string;
  }
}

declare const UserMenuScssModule: UserMenuScssNamespace.IUserMenuScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserMenuScssNamespace.IUserMenuScss;
};

export = UserMenuScssModule;
