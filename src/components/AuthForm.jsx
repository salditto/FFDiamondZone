import { AuthBox, Title, Input, Button, SwitchLink } from "../styles/AuthStyles";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AuthForm({ type = "login", onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const isLogin = type === "login";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <AuthBox>
      <Title>{isLogin ? t("auth.login_title") : t("auth.register_title")}</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder={t("auth.email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t("auth.password_placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">
          {isLogin ? t("auth.login_button") : t("auth.register_button")}
        </Button>
      </form>
      <SwitchLink>
        {isLogin ? (
          <>
            {t("auth.no_account")} <Link to="/register">{t("auth.register_link")}</Link>
          </>
        ) : (
          <>
            {t("auth.have_account")} <Link to="/login">{t("auth.login_link")}</Link>
          </>
        )}
      </SwitchLink>
    </AuthBox>
  );
}
