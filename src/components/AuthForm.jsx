import { AuthBox, Title, Input, Button, SwitchLink } from "../styles/AuthStyles";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AuthForm({ type = "login", onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = type === "login";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <AuthBox>
      <Title>{isLogin ? "Login" : "Register"}</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
      </form>
      <SwitchLink>
        {isLogin ? (
          <>
            Don't have an account? <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            Already have an account? <Link to="/login">Login</Link>
          </>
        )}
      </SwitchLink>
    </AuthBox>
  );
}
