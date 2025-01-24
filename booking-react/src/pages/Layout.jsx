import { Outlet } from "react-router-dom";

import Navigation from "../components/Navigation";
import styles from "../components/Layout.module.css";

export default function Layout({ user, setUser }) {
  return (
    <div className={styles.container}>
      <header className={styles.mainHeader}>
        <Navigation user={user} />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
