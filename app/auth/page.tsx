"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError(t("auth_password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push("/documentos");
    } catch (err: any) {
      setError(err.message || t("auth_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push("/documentos");
    } catch (err: any) {
      setError(err.message || t("auth_error_google"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex justify-center items-start min-h-screen px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-effect hover-box p-6 sm:p-8 rounded-xl border border-blue-500/40 w-full">
            <h1 className="hover-title block w-full text-2xl sm:text-3xl font-bold mb-2 text-center text-foreground">
              {isLogin ? t("auth_sign_in") : t("auth_sign_up")}
            </h1>
            <p className="text-muted text-center mb-6 sm:mb-8 text-sm sm:text-base">
              {isLogin ? t("auth_access_continue") : t("auth_create_begin")}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center text-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  {t("auth_email")}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t("auth_placeholder_email")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center text-foreground">
                  <Lock className="w-4 h-4 mr-2" />
                  {t("auth_password")}
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center text-foreground">
                    <Lock className="w-4 h-4 mr-2" />
                    {t("auth_confirm_password")}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full i18n-stable-btn flex items-center justify-center min-w-[12rem]"
                disabled={loading}
              >
                {loading ? (
                  t("auth_loading")
                ) : isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2 inline-block align-middle" />
                    <span className="inline-block align-middle">{t("auth_sign_in")}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2 inline-block align-middle" />
                    <span className="inline-block align-middle">{t("auth_sign_up")}</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-sm text-muted shrink-0 px-2">{t("auth_or_continue")}</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Image
                  src="/google-g-logo.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>{t("auth_google")}</span>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setConfirmPassword("");
                }}
                className="text-blue-500 hover:text-blue-400 text-sm"
              >
                {isLogin ? t("auth_no_account") : t("auth_has_account")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
