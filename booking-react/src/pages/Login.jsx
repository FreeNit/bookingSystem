import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LoginForm from "../components/LoginForm";

export default function Login({ setUser }) {
  return (
    <>
      <LoginForm setUser={setUser} />
    </>
  );
}
