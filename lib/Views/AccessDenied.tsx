import { FC } from "react";
import { getUserDisplayName, doLogout } from "../auth/keycloak";

const AccessDenied: FC = () => {
  const name = getUserDisplayName();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#111827",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
        gap: "20px",
        padding: "24px"
      }}
    >
      <img
        src="images/iihs_logo_white.svg"
        alt="IIHS Geospatial Lab"
        style={{ height: "52px" }}
      />

      <div
        style={{
          width: "2px",
          height: "36px",
          background: "#881802",
          borderRadius: "1px"
        }}
      />

      <h1
        style={{
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "0.01em"
        }}
      >
        Access Denied
      </h1>

      <p
        style={{
          margin: 0,
          opacity: 0.7,
          textAlign: "center",
          maxWidth: "420px",
          lineHeight: 1.6,
          fontSize: "0.95rem"
        }}
      >
        {name ? (
          <>
            Signed in as{" "}
            <strong style={{ color: "white", opacity: 1 }}>{name}</strong>.{" "}
          </>
        ) : null}
        Your account does not have the required role to access this portal.
        Contact your administrator to request access.
      </p>

      <button
        onClick={doLogout}
        style={{
          marginTop: "8px",
          background: "#881802",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "10px 28px",
          fontSize: "0.9rem",
          cursor: "pointer",
          letterSpacing: "0.02em"
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default AccessDenied;
