import { FC } from "react";
import { doLogout } from "../auth/keycloak";
import Styles from "./user-menu.scss";

const UserMenuItem: FC = () => (
  <div>
    <button
      className={Styles.signOutBtn}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        doLogout();
      }}
    >
      <span>Sign Out</span>
    </button>
  </div>
);

export default UserMenuItem;
