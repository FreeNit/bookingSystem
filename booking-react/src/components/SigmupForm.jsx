import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";

export default function SignupForm({ setUser }) {
  const navigate = useNavigate();

  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const response = fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    response
      .then((response) => {
        if (response.status === 201 && response.ok) {
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.row}>
          <label htmlFor="userName">User Name</label>
          <input type="text" name="userName" required id="userName" />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required id="email" />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required id="password" />
        </div>

        <div className={styles.row}>
          <label htmlFor="userType">User Type</label>
          <select name="userType" id="userType">
            <option value="client">Client</option>
            <option value="business">Business</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <Button type="submit" text="Sign up" />
        </div>
      </form>
    </div>
  );
}
