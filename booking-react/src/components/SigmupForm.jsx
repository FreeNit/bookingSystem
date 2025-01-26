import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./Form.module.css";
import Button from "./Button";

const schema = z.object({
  userName: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(5),
  userType: z.string().min(5),
});

export default function SignupForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (signUpData) => {
    try {
      const signUpURL = await "http://localhost:3000/users/signup";
      const signUpResponse = await fetch(signUpURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });

      if (signUpResponse.status === 409 && !signUpResponse.ok) {
        const data = await signUpResponse.json();
        throw new Error(data.message);
      }
      if (signUpResponse.status === 201 && signUpResponse.ok) {
        navigate("/signin");
      }
    } catch (error) {
      setError("root", {
        message: `${error}`,
      });
    }
  };

  // function handleFormSubmit() {
  //   const formData = new FormData(e.target);
  //   const formValues = Object.fromEntries(formData);

  //   const response = fetch("http://localhost:3000/users/signup", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(formValues),
  //   });
  //   response
  //     .then((response) => {
  //       if (response.status === 201 && response.ok) {
  //         navigate("/signin");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log({ err });
  //     });
  // }

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label htmlFor="userName">User Name</label>
          <input
            {...register("userName")}
            type="text"
            name="userName"
            id="userName"
          />
          {errors.userName && (
            <div className={styles.error}>{errors.userName.message}</div>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input {...register("email")} type="email" name="email" id="email" />
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
          />
          {errors.password && (
            <div className={styles.error}>{errors.password.message}</div>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="userType">User Type</label>
          <select {...register("userType")} name="userType" id="userType">
            <option value="client">Client</option>
            <option value="business">Business</option>
            <option value="admin">Admin</option>
          </select>
          {errors.userType && (
            <div className={styles.error}>{errors.userType.message}</div>
          )}
        </div>

        <div className={styles.buttons}>
          <Button
            type="submit"
            text={isSubmitting ? "Loading..." : "Sign up"}
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
