import { NavLink } from "react-router-dom";

import styles from "./Navigation.module.css";

export default function Navigation({ user, setUser }) {
  function handleLogout() {
    setUser("");
  }

  return (
    <>
      <nav className={styles.mainNavigation}>
        <div className={styles.linkContainer}>
          <NavLink className="logo" to="/">
            <img src="./icon.png" />
          </NavLink>

          {user?.userType === "client" && (
            <NavLink className="cta" to="/booking">
              Booking
            </NavLink>
          )}
          {user?.userType === "admin" && (
            <NavLink className="cta" to="/admin">
              Admin page
            </NavLink>
          )}
        </div>
        <div className={styles.linkContainer}>
          {!user && (
            <>
              <NavLink className="cta" to="/signin">
                Log In
              </NavLink>

              <NavLink to="/signup" className="cta">
                Sign up
              </NavLink>
            </>
          )}

          {user && (
            <NavLink className="cta" to="/" onClick={handleLogout}>
              Log out
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
}
