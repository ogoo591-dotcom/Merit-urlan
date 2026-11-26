"use client";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Flow = "signIn" | "signUp";

type AuthFormProps = {
  // Амжилттай нэвтэрсний дараа дуудагдана (модал хаах эсвэл хуудас шилжих).
  onSuccess: () => void;
  onGuest: () => void;
  onClose?: () => void;
  redirectTo: string;
};

const codeLength = 6;
const resendSeconds = 60;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Facebook, Messenger, Instagram зэргийн дотоод браузерт Google OAuth-ийг хаадаг (disallowed_useragent).
const inAppBrowserPattern = /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Line\/|KAKAOTALK|TikTok/i;

const noopSubscribe = () => () => {};
function useInAppBrowser() {
  return useSyncExternalStore(noopSubscribe, () => inAppBrowserPattern.test(navigator.userAgent), () => false);
}

function readError(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    const first = error.errors[0];
    switch (first?.code) {
      case "form_code_incorrect":
        return "Код буруу байна. Дахин шалгана уу.";
      case "verification_expired":
        return "Кодын хугацаа дууссан. Шинэ код авна уу.";
      case "too_many_requests":
        return "Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.";
      case "form_param_format_invalid":
      case "form_identifier_invalid":
        return "Имэйл буруу форматтай байна.";
      case "strategy_for_user_invalid":
        return "Энэ имэйл Google-ээр бүртгэгдсэн байна. «Google-р нэвтрэх»-ийг сонгоно уу.";
      default:
        return first?.longMessage ?? first?.message ?? "Алдаа гарлаа. Дахин оролдоно уу.";
    }
  }
  return "Алдаа гарлаа. Дахин оролдоно уу.";
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
      <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6z" fill="#FBBC05" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#EA4335" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 text-[12px] text-[#8a7b73]">
      <span className="h-px flex-1 bg-[#eadfd5]" />
      Эсвэл
      <span className="h-px flex-1 bg-[#eadfd5]" />
    </div>
  );
}

const outlineButtonClass =
  "flex w-full items-center rounded-[14px] border border-[#eadfd5] bg-white px-6 py-4 text-[14px] text-[#4a3b35] transition hover:border-[#6e4f45] disabled:opacity-50";

// Үндсэн арга Google; имэйлээр код авах нь нөөц (дотоод браузер, Gmail-гүй хэрэглэгч).
export function AuthForm({ onSuccess, onGuest, onClose, redirectTo }: AuthFormProps) {
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const inAppBrowser = useInAppBrowser();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"identify" | "verify">("identify");
  const [flow, setFlow] = useState<Flow>("signIn");
  const [code, setCode] = useState<string[]>(() => Array(codeLength).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  const ready = signInLoaded && signUpLoaded;
  const emailAddress = email.trim();
  const emailValid = emailPattern.test(emailAddress);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (step === "verify") codeRefs.current[0]?.focus();
  }, [step]);

  // Бүртгэлтэй бол нэвтрэх код, бүртгэлгүй бол шинээр бүртгэх код илгээнэ.
  async function sendCode() {
    if (!ready || !emailValid) return;
    setBusy(true);
    setError(null);

    try {
      try {
        const attempt = await signIn.create({ identifier: emailAddress });
        const factor = attempt.supportedFirstFactors?.find((item) => item.strategy === "email_code");
        if (!factor || factor.strategy !== "email_code") throw new Error("NO_FACTOR");
        await attempt.prepareFirstFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });
        setFlow("signIn");
      } catch (signInError) {
        const notFound =
          isClerkAPIResponseError(signInError) && signInError.errors[0]?.code === "form_identifier_not_found";
        if (!notFound) throw signInError;

        await signUp.create({ emailAddress });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setFlow("signUp");
      }

      setCode(Array(codeLength).fill(""));
      setSecondsLeft(resendSeconds);
      setStep("verify");
    } catch (sendError) {
      setError(
        sendError instanceof Error && sendError.message === "NO_FACTOR"
          ? "Энэ имэйлээр код илгээх боломжгүй байна. «Google-р нэвтрэх»-ийг сонгоно уу."
          : readError(sendError),
      );
    } finally {
      setBusy(false);
    }
  }

  async function verify(value: string) {
    if (!ready || value.length !== codeLength) return;
    setBusy(true);
    setError(null);

    try {
      if (flow === "signIn") {
        const result = await signIn.attemptFirstFactor({ strategy: "email_code", code: value });
        if (result.status !== "complete") throw new Error(`SIGN_IN_${result.status}`);
        await setActive({ session: result.createdSessionId });
      } else {
        const result = await signUp.attemptEmailAddressVerification({ code: value });
        if (result.status !== "complete") throw new Error(`SIGN_UP_${result.status}`);
        await setActive({ session: result.createdSessionId });
      }
      onSuccess();
    } catch (verifyError) {
      setError(
        verifyError instanceof Error && verifyError.message.startsWith("SIGN_")
          ? "Нэмэлт мэдээлэл шаардлагатай байна. Clerk тохиргоонд зөвхөн имэйл шаарддаг эсэхийг шалгана уу."
          : readError(verifyError),
      );
      setCode(Array(codeLength).fill(""));
      codeRefs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  }

  function updateCode(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    const next = [...code];

    // Имэйлээс бүтэн кодыг хуулж буулгасан тохиолдол.
    if (digits.length > 1) {
      digits.slice(0, codeLength - index).split("").forEach((digit, offset) => (next[index + offset] = digit));
    } else {
      next[index] = digits;
    }

    setCode(next);
    const filled = next.join("");
    const focusIndex = Math.min(index + Math.max(digits.length, 1), codeLength - 1);
    if (digits) codeRefs.current[focusIndex]?.focus();
    if (filled.length === codeLength) void verify(filled);
  }

  // Шинэ хэрэглэгч бол /sso-callback дээр Clerk өөрөө бүртгэл рүү шилжүүлнэ.
  async function continueWithGoogle() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectTo,
      });
    } catch (oauthError) {
      setError(readError(oauthError));
      setBusy(false);
    }
  }

  if (step === "verify") {
    return (
      <div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[26px] font-semibold text-[#2f2420]">Баталгаажуулах</h2>
          {onClose ? (
            <button type="button" aria-label="Хаах" onClick={onClose} className="text-[#4a3b35] hover:text-[#6e4f45]">
              <CloseIcon />
            </button>
          ) : null}
        </div>

        <p className="mt-6 text-[15px] leading-[1.8] text-[#4a3b35]">
          Таны <strong className="text-[#2f2420]">{emailAddress}</strong> хаягт илгээсэн 6 оронтой баталгаажуулах кодыг оруулна уу.
        </p>

        <div className="mt-8 grid grid-cols-6 gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                codeRefs.current[index] = element;
              }}
              value={digit}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Кодын ${index + 1}-р орон`}
              disabled={busy}
              onChange={(event) => updateCode(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !code[index] && index > 0) codeRefs.current[index - 1]?.focus();
              }}
              className="aspect-square w-full rounded-[14px] border border-[#eadfd5] bg-white text-center text-[22px] font-semibold text-[#2f2420] outline-none transition focus:border-[#2f2420] focus:ring-1 focus:ring-[#2f2420] disabled:opacity-60"
            />
          ))}
        </div>

        {error ? <p className="mt-4 text-[13px] text-[#b04a4a]">{error}</p> : null}

        <div className="mt-10 text-center text-[14px] text-[#8a7b73]">
          {secondsLeft > 0 ? (
            <>Дахин код авах: {secondsLeft}с</>
          ) : (
            <button type="button" disabled={busy} onClick={sendCode} className="font-medium text-[#6e4f45] underline">
              Код дахин илгээх
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setStep("identify");
            setError(null);
          }}
          className="mt-4 w-full text-center text-[13px] text-[#8a7b73] hover:text-[#4a3b35]"
        >
          ← Имэйл солих
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[26px] font-semibold text-[#2f2420]">Нэвтрэх</h2>
        {onClose ? (
          <button type="button" aria-label="Хаах" onClick={onClose} className="text-[#4a3b35] hover:text-[#6e4f45]">
            <CloseIcon />
          </button>
        ) : null}
      </div>

      <p className="mt-6 text-[15px] leading-[1.8] text-[#4a3b35]">
        Та нэвтрээд дуртай бүтээлээ хадгалж, захиалга өгөөрэй!
      </p>

      <button
        type="button"
        disabled={busy || !ready || inAppBrowser}
        onClick={continueWithGoogle}
        className={`${outlineButtonClass} mt-6`}
      >
        <GoogleIcon />
        <span className="flex-1 text-center">Google-р нэвтрэх</span>
      </button>
      {inAppBrowser ? (
        <p className="mt-3 rounded-[12px] bg-[#fdf0dc] px-4 py-3 text-[12px] leading-[1.7] text-[#9a6412]">
          Facebook, Messenger доторх хөтөчөөс Google-р нэвтрэх боломжгүй. Баруун дээд буланд «…» → «Хөтөчид нээх»-ийг дарах
          эсвэл доор имэйлээрээ нэвтэрнэ үү.
        </p>
      ) : null}

      <div className="mt-6">
        <Divider />
      </div>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void sendCode();
        }}
      >
        <label htmlFor="auth-email" className="mb-3 block text-[14px] text-[#2f2420]">
          Имэйлээр код авах
        </label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="name@example.com"
          className="w-full rounded-[14px] border border-[#eadfd5] bg-white px-5 py-4 text-[16px] text-[#2f2420] outline-none placeholder:text-[#b3a69e] focus:border-[#2f2420] focus:ring-1 focus:ring-[#2f2420]"
        />

        {error ? <p className="mt-3 text-[13px] text-[#b04a4a]">{error}</p> : null}

        {/* Clerk-ийн бот хамгаалалт (CAPTCHA) энд гарч ирнэ. */}
        <div id="clerk-captcha" className="mt-3" />

        <button
          type="submit"
          disabled={!ready || !emailValid || busy}
          className="mt-3 w-full rounded-[14px] bg-[#2f2420] px-6 py-4 text-[16px] font-medium text-white transition hover:bg-[#6e4f45] disabled:cursor-not-allowed disabled:bg-[#c9bfb8]"
        >
          {busy ? "Илгээж байна…" : "Код авах"}
        </button>
      </form>

      <p className="mt-6 text-[12px] leading-[1.8] text-[#8a7b73]">
        Нэвтэрснээр та манай <span className="underline">Үйлчилгээний нөхцөл</span>,{" "}
        <span className="underline">Нууцлалын бодлого</span>той танилцаж, зөвшөөрсөнд тооцогдоно.
      </p>

      <div className="mt-6">
        <Divider />
      </div>

      <button type="button" onClick={onGuest} className={`${outlineButtonClass} mt-6 justify-center`}>
        Зочноор үргэлжлүүлэх
      </button>
    </div>
  );
}
