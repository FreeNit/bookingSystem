import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";

import styles from "./Form.module.css";

import Button from "./Button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (loginData) => {
    try {
      const loginResponse = await fetch(
        "https://booking-system-2hms.onrender.com/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await loginResponse.json();
      const userData = jwtDecode(data.token);
      if (userData.userType === "client") {
        navigate("/booking");
      }
      if (userData.userType === "admin") {
        navigate("/admin");
      }
      setUser({ token: data.token, ...userData });
    } catch (error) {
      setError("root", {
        message: "Auth failed",
      });
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            type="email"
            name="email"
            id="email"
            placeholder="email"
          />
          {errors.email && (
            <div className={styles.error}>{errors.email.message}</div>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            {...register("password")}
            type="password"
            name="password"
            id="password"
            placeholder="password"
          />
          {errors.password && (
            <div className={styles.error}>{errors.password.message}</div>
          )}
        </div>

        <div className={styles.buttons}>
          <Button
            type="submit"
            text={isSubmitting ? "Loading..." : "Log in"}
            disabled={isSubmitting}
          />
        </div>
        {errors.root && (
          <div className={styles.error}>{errors.root.message}</div>
        )}
      </form>
    </div>
  );
}
