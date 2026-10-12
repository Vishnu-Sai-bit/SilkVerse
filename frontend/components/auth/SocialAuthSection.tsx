"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  googleLoginUser,
  facebookLoginUser,
  appleLoginUser,
  demoSocialLoginUser,
} from "@/services/api";
import { Sparkles, X, Info, Loader2, ExternalLink, KeyRound } from "lucide-react";

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
    AppleID?: any;
  }
}

export default function SocialAuthSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";
  const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "";

  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"google" | "facebook" | "apple">("google");

  const tokenClientRef = useRef<any>(null);
  const isGoogleInitializedRef = useRef(false);
  const isFbInitializedRef = useRef(false);
  const isAppleInitializedRef = useRef(false);

  // =====================================
  // 1. Google OAuth Setup
  // =====================================
  const initializeGoogleAuth = useCallback(() => {
    if (!window.google?.accounts?.oauth2 || !googleClientId) return;
    if (isGoogleInitializedRef.current && tokenClientRef.current) return;

    try {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse?.error) {
            if (tokenResponse.error === "popup_closed_by_user") {
              return;
            }
            if (tokenResponse.error === "access_denied") {
              toast.error("Google sign-in was cancelled.", { id: "social-login" });
              return;
            }
            toast.error(
              tokenResponse.error_description || `Google sign-in error: ${tokenResponse.error}`,
              { id: "social-login" }
            );
            return;
          }

          if (tokenResponse?.access_token) {
            try {
              setLoading(true);
              setActiveProvider("google");
              toast.loading("Signing in with Google...", { id: "social-login" });

              const data = await googleLoginUser({
                accessToken: tokenResponse.access_token,
              });
              await login(data.token);

              toast.success(`Welcome, ${data.user?.name || "Customer"}!`, {
                id: "social-login",
              });
              router.push(redirectUrl);
            } catch (err: any) {
              toast.error(
                err?.message || "Google authentication failed",
                { id: "social-login" }
              );
            } finally {
              setLoading(false);
              setActiveProvider(null);
            }
          }
        },
      });
      isGoogleInitializedRef.current = true;
    } catch (e) {
      console.warn("Google OAuth initialization warning:", e);
    }
  }, [googleClientId, login, redirectUrl, router]);

  // Load Google Identity Services script
  useEffect(() => {
    if (!googleClientId) return;

    if (window.google?.accounts?.oauth2) {
      initializeGoogleAuth();
      return;
    }

    const scriptId = "google-gsi-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleAuth();
      };
      document.body.appendChild(script);
    } else {
      const handleLoad = () => initializeGoogleAuth();
      script.addEventListener("load", handleLoad);
      return () => script?.removeEventListener("load", handleLoad);
    }
  }, [googleClientId, initializeGoogleAuth]);

  // =====================================
  // 2. Facebook SDK Setup
  // =====================================
  const initializeFacebookSDK = useCallback(() => {
    if (!facebookAppId || !window.FB || isFbInitializedRef.current) return;
    try {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
      isFbInitializedRef.current = true;
    } catch (e) {
      console.warn("Facebook SDK init warning:", e);
    }
  }, [facebookAppId]);

  useEffect(() => {
    if (!facebookAppId) return;

    if (window.FB) {
      initializeFacebookSDK();
      return;
    }

    window.fbAsyncInit = () => {
      initializeFacebookSDK();
    };

    const scriptId = "facebook-jssdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [facebookAppId, initializeFacebookSDK]);

  // =====================================
  // 3. Apple Sign-In SDK Setup
  // =====================================
  const initializeAppleSDK = useCallback(() => {
    if (!appleClientId || !window.AppleID || isAppleInitializedRef.current) return;
    try {
      window.AppleID.auth.init({
        clientId: appleClientId,
        scope: "name email",
        redirectURI: typeof window !== "undefined" ? `${window.location.origin}/login` : "http://localhost:3001/login",
        usePopup: true,
      });
      isAppleInitializedRef.current = true;
    } catch (e) {
      console.warn("Apple SDK init warning:", e);
    }
  }, [appleClientId]);

  useEffect(() => {
    if (!appleClientId) return;

    if (window.AppleID) {
      initializeAppleSDK();
      return;
    }

    const scriptId = "apple-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/auth.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeAppleSDK();
      };
      document.body.appendChild(script);
    }
  }, [appleClientId, initializeAppleSDK]);

  // =====================================
  // Click Handlers
  // =====================================
  const handleGoogleClick = () => {
    if (!googleClientId) {
      setSelectedProvider("google");
      setModalOpen(true);
      return;
    }

    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
      return;
    }

    if (window.google?.accounts?.oauth2) {
      initializeGoogleAuth();
      if (tokenClientRef.current) {
        tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
        return;
      }
    }

    toast.error("Google Sign-In is initializing. Please try again in a moment.", {
      id: "social-login",
    });
  };

  const handleFacebookClick = () => {
    if (!facebookAppId) {
      // Open modal with step-by-step Meta developer setup and one-click test
      setSelectedProvider("facebook");
      setModalOpen(true);
      return;
    }

    if (!window.FB) {
      toast.error("Facebook SDK is loading. Please try again in a moment.", { id: "social-login" });
      return;
    }

    try {
      window.FB.login(
        async (response: any) => {
          if (response?.authResponse?.accessToken) {
            try {
              setLoading(true);
              setActiveProvider("facebook");
              toast.loading("Signing in with Facebook...", { id: "social-login" });

              const data = await facebookLoginUser({
                accessToken: response.authResponse.accessToken,
                userID: response.authResponse.userID,
              });
              await login(data.token);

              toast.success(`Welcome, ${data.user?.name || "Customer"}!`, { id: "social-login" });
              router.push(redirectUrl);
            } catch (err: any) {
              toast.error(err?.message || "Facebook login failed", { id: "social-login" });
            } finally {
              setLoading(false);
              setActiveProvider(null);
            }
          } else {
            toast.error("Facebook sign-in was cancelled.", { id: "social-login" });
          }
        },
        { scope: "public_profile,email" }
      );
    } catch (e: any) {
      console.error("Facebook login trigger error:", e);
      setSelectedProvider("facebook");
      setModalOpen(true);
    }
  };

  const handleAppleClick = async () => {
    if (!appleClientId) {
      // Open modal with step-by-step Apple developer setup and one-click test
      setSelectedProvider("apple");
      setModalOpen(true);
      return;
    }

    if (!window.AppleID) {
      toast.error("Apple Sign-In is loading. Please try again in a moment.", { id: "social-login" });
      return;
    }

    try {
      setLoading(true);
      setActiveProvider("apple");
      toast.loading("Connecting to Apple...", { id: "social-login" });

      const data = await window.AppleID.auth.signIn();
      if (data?.authorization?.id_token) {
        const result = await appleLoginUser({
          id_token: data.authorization.id_token,
          code: data.authorization.code,
          user: data.user,
        });
        await login(result.token);

        toast.success(`Welcome, ${result.user?.name || "Customer"}!`, { id: "social-login" });
        router.push(redirectUrl);
      }
    } catch (err: any) {
      if (err?.error !== "popup_closed_by_user") {
        toast.error(err?.message || "Apple sign-in cancelled or failed", { id: "social-login" });
      }
    } finally {
      setLoading(false);
      setActiveProvider(null);
    }
  };

  const handleSocialClick = (provider: "google" | "facebook" | "apple") => {
    if (provider === "google") {
      handleGoogleClick();
    } else if (provider === "facebook") {
      handleFacebookClick();
    } else if (provider === "apple") {
      handleAppleClick();
    }
  };

  const handleExecuteDemoLogin = async (provider: "google" | "facebook" | "apple") => {
    try {
      setLoading(true);
      setActiveProvider(provider);
      toast.loading(`Signing in with ${provider.toUpperCase()} (Test Profile)...`, { id: "social-login" });

      const data = await demoSocialLoginUser(provider);
      await login(data.token);

      toast.success(`Welcome back, ${data.user?.name}!`, { id: "social-login" });
      setModalOpen(false);
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error(err?.message || "Social login failed.", { id: "social-login" });
    } finally {
      setLoading(false);
      setActiveProvider(null);
    }
  };

  return (
    <>
      {/* 3 Luxury Social Buttons matching Page 21 Auth Blueprint */}
      <div className="grid grid-cols-3 gap-3">
        {/* Google Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialClick("google")}
          className="h-10 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-stone-50 flex items-center justify-center text-xs font-semibold text-stone-700 transition-all shadow-2xs gap-2 active:scale-98 disabled:opacity-50 cursor-pointer group"
          title="Sign in with Google"
        >
          {loading && activeProvider === "google" ? (
            <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
          ) : (
            <FaGoogle className="text-red-500 text-sm group-hover:scale-110 transition-transform" />
          )}
          <span className="hidden sm:inline">Google</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialClick("facebook")}
          className="h-10 rounded-xl bg-white border border-stone-200 hover:border-blue-300 hover:bg-stone-50 flex items-center justify-center text-xs font-semibold text-stone-700 transition-all shadow-2xs gap-2 active:scale-98 disabled:opacity-50 cursor-pointer group"
          title="Sign in with Facebook"
        >
          {loading && activeProvider === "facebook" ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <FaFacebookF className="text-blue-600 text-sm group-hover:scale-110 transition-transform" />
          )}
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialClick("apple")}
          className="h-10 rounded-xl bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 flex items-center justify-center text-xs font-semibold text-stone-700 transition-all shadow-2xs gap-2 active:scale-98 disabled:opacity-50 cursor-pointer group"
          title="Sign in with Apple"
        >
          {loading && activeProvider === "apple" ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <FaApple className="text-black text-base group-hover:scale-110 transition-transform" />
          )}
          <span className="hidden sm:inline">Apple</span>
        </button>
      </div>

      {/* Modal: Setup Guidance & Instant Verified Login */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#D4AF37]/30 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/40 flex items-center justify-center text-[#6D001A]">
                  {selectedProvider === "google" && <FaGoogle className="text-red-500 text-lg" />}
                  {selectedProvider === "facebook" && <FaFacebookF className="text-blue-600 text-lg" />}
                  {selectedProvider === "apple" && <FaApple className="text-black text-xl" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D2A26] capitalize">
                    {selectedProvider} Sign-In & Registration
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    SilkVerse OAuth 2.0 Integration
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Provider-specific Developer Instructions */}
            {selectedProvider === "facebook" && (
              <div className="p-3.5 rounded-2xl bg-[#F0F5FF] border border-blue-200 space-y-2.5 text-xs text-[#2D2A26]">
                <div className="flex items-center gap-1.5 font-bold text-blue-800">
                  <KeyRound size={14} />
                  <span>Meta / Facebook App Configuration</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600">
                  To connect live Facebook Login:
                </p>
                <ol className="list-decimal list-inside text-[11px] text-stone-600 space-y-1 pl-1">
                  <li>
                    Visit{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      developers.facebook.com <ExternalLink size={10} />
                    </a>
                  </li>
                  <li>Create an App &rarr; Select <strong>Authenticate users with Facebook Login</strong>.</li>
                  <li>Add <strong>Facebook Login for Web</strong> & set Site URL to <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[10px]">http://localhost:3001</code>.</li>
                  <li>Copy your <strong>App ID</strong> into <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_FACEBOOK_APP_ID</code>.</li>
                </ol>
              </div>
            )}

            {selectedProvider === "apple" && (
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-stone-200 space-y-2.5 text-xs text-[#2D2A26]">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <KeyRound size={14} />
                  <span>Apple Developer Services ID</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600">
                  Sign in with Apple requires an active <strong>Apple Developer Program</strong> ($99/year enrollment):
                </p>
                <ol className="list-decimal list-inside text-[11px] text-stone-600 space-y-1 pl-1">
                  <li>Log in to <a href="https://developer.apple.com/account" target="_blank" rel="noopener noreferrer" className="text-stone-900 font-semibold underline inline-flex items-center gap-0.5">developer.apple.com <ExternalLink size={10} /></a></li>
                  <li>Under <strong>Certificates, Identifiers & Profiles</strong>, create a <strong>Services ID</strong>.</li>
                  <li>Enable <strong>Sign In with Apple</strong> and add your web domain / return URL.</li>
                  <li>Set your Services ID into <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_APPLE_CLIENT_ID</code>.</li>
                </ol>
              </div>
            )}

            {selectedProvider === "google" && (
              <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/30 space-y-2 text-xs text-[#2D2A26]">
                <div className="flex items-center gap-1.5 font-bold text-[#6D001A]">
                  <Info size={14} />
                  <span>Google Cloud Integration Active</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600">
                  Live Google Sign-In is configured with Client ID:
                  <br />
                  <code className="bg-amber-100/70 px-1 py-0.5 rounded font-mono text-[10px] break-all">
                    {googleClientId}
                  </code>
                </p>
              </div>
            )}

            {/* Instant Verified Test Login Button */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleExecuteDemoLogin(selectedProvider)}
                className="w-full h-11 rounded-xl bg-[#6D001A] hover:bg-[#5B0D16] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span>Test Login with {selectedProvider.toUpperCase()} Profile</span>
              </button>
              <p className="text-[10px] text-center text-gray-400">
                Creates or connects a real verified {selectedProvider.toUpperCase()} customer in your MongoDB database to test cart, checkout, orders, and addresses.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
