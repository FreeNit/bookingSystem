import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import styles from "./Form.module.css";

import Button from "./Button";

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleInputChange(e) {
    setEmail(e.target.value);
  }

  function handlePassChange(e) {
    setPassword(e.target.value);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    const loginResponse = fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    loginResponse
      .then((response) => response.json())
      .then((data) => {
        const userData = jwtDecode(data.token);
        if (userData.userType === "client") {
          navigate("/booking");
        }
        if (userData.userType === "admin") {
          navigate("/admin");
        }
        setUser({ token: data.token, ...userData });
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            required
            id="email"
            value={email}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            required
            id="password"
            value={password}
            onChange={handlePassChange}
            min="4"
          />
        </div>

        <div className={styles.buttons}>
          <Button type="submit" text="Log in" />
        </div>
      </form>
    </div>
  );
}
