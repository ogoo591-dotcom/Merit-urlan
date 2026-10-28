"use client";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { useEffect, useRef, useState } from "react";

type Method = "phone" | "email";
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
const phonePattern = /^[0-9]{8}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        return "Утасны дугаар эсвэл имэйл буруу форматтай байна.";
      case "strategy_for_user_invalid":
        return "Энэ аргаар нэвтрэх боломжгүй. Нөгөө аргыг сонгоно уу.";
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

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.1 12.9l.4-2.8h-2.7V8.3c0-.8.4-1.5 1.6-1.5h1.2V4.4s-1.1-.2-2.2-.2c-2.2 0-3.7 1.4-3.7 3.8v2.1H7.3v2.8h2.4V20h3.1v-7.1h2.3z"
        fill="#fff"
      />
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

export function AuthForm({ onSuccess, onGuest, onClose, redirectTo }: AuthFormProps) {
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  const [method, setMethod] = useState<Method>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"identify" | "verify">("identify");
  const [flow, setFlow] = useState<Flow>("signIn");
  const [code, setCode] = useState<string[]>(() => Array(codeLength).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  const ready = signInLoaded && signUpLoaded;
  const identifierValid = method === "phone" ? phonePattern.test(phone) : emailPattern.test(email.trim());
  const displayIdentifier = method === "phone" ? phone : email.trim();

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
    if (!ready || !identifierValid) return;
    setBusy(true);
    setError(null);

    const phoneNumber = `+976${phone}`;
    const emailAddress = email.trim();

    try {
      try {
        const attempt = await signIn.create({ identifier: method === "phone" ? phoneNumber : emailAddress });
        if (method === "phone") {
          const factor = attempt.supportedFirstFactors?.find((item) => item.strategy === "phone_code");
          if (!factor || factor.strategy !== "phone_code") throw new Error("NO_FACTOR");
          await attempt.prepareFirstFactor({ strategy: "phone_code", phoneNumberId: factor.phoneNumberId });
        } else {
          const factor = attempt.supportedFirstFactors?.find((item) => item.strategy === "email_code");
          if (!factor || factor.strategy !== "email_code") throw new Error("NO_FACTOR");
          await attempt.prepareFirstFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });
        }
        setFlow("signIn");
      } catch (signInError) {
        const notFound =
          isClerkAPIResponseError(signInError) && signInError.errors[0]?.code === "form_identifier_not_found";
        if (!notFound) throw signInError;

        if (method === "phone") {
          await signUp.create({ phoneNumber });
          await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
        } else {
          await signUp.create({ emailAddress });
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        }
        setFlow("signUp");
      }

      setCode(Array(codeLength).fill(""));
      setSecondsLeft(resendSeconds);
      setStep("verify");
    } catch (sendError) {
      setError(
        sendError instanceof Error && sendError.message === "NO_FACTOR"
          ? "Энэ аргаар код илгээх боломжгүй байна. Нөгөө аргыг сонгоно уу."
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
        const result = await signIn.attemptFirstFactor({
          strategy: method === "phone" ? "phone_code" : "email_code",
          code: value,
        });
        if (result.status !== "complete") throw new Error(`SIGN_IN_${result.status}`);
        await setActive({ session: result.createdSessionId });
      } else {
        const result =
          method === "phone"
            ? await signUp.attemptPhoneNumberVerification({ code: value })
            : await signUp.attemptEmailAddressVerification({ code: value });
        if (result.status !== "complete") throw new Error(`SIGN_UP_${result.status}`);
        await setActive({ session: result.createdSessionId });
      }
      onSuccess();
    } catch (verifyError) {
      setError(
        verifyError instanceof Error && verifyError.message.startsWith("SIGN_")
          ? "Нэмэлт мэдээлэл шаардлагатай байна. Clerk тохиргоонд зөвхөн утас/имэйл шаарддаг эсэхийг шалгана уу."
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

    // Мессежээс бүтэн кодыг хуулж буулгасан тохиолдол.
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

  async function continueWithOAuth(strategy: "oauth_google" | "oauth_facebook") {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
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
          Таны <strong className="text-[#2f2420]">{displayIdentifier}</strong>{" "}
          {method === "phone" ? "дугаарт" : "хаягт"} илгээсэн 6 оронтой баталгаажуулах кодыг оруулна уу.
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
          ← {method === "phone" ? "Дугаар" : "Имэйл"} солих
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

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void sendCode();
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="auth-identifier" className="text-[14px] text-[#2f2420]">
            {method === "phone" ? "Утас" : "Имэйл"}
          </label>
          <button
            type="button"
            onClick={() => {
              setMethod(method === "phone" ? "email" : "phone");
              setError(null);
            }}
            className="text-[13px] font-medium text-[#6e4f45] underline-offset-4 hover:underline"
          >
            {method === "phone" ? "Имэйлээр нэвтрэх" : "Утсаар нэвтрэх"}
          </button>
        </div>

        <div className="flex overflow-hidden rounded-[14px] border border-[#eadfd5] bg-white focus-within:border-[#2f2420] focus-within:ring-1 focus-within:ring-[#2f2420]">
          {method === "phone" ? (
            <span className="flex items-center border-r border-[#eadfd5] px-5 text-[16px] text-[#8a7b73]">+976</span>
          ) : null}
          {method === "phone" ? (
            <input
              id="auth-identifier"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 8))}
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Энд оруулна уу"
              className="min-w-0 flex-1 px-5 py-4 text-[16px] text-[#2f2420] outline-none placeholder:text-[#b3a69e]"
            />
          ) : (
            <input
              id="auth-identifier"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@example.com"
              className="min-w-0 flex-1 px-5 py-4 text-[16px] text-[#2f2420] outline-none placeholder:text-[#b3a69e]"
            />
          )}
        </div>

        {error ? <p className="mt-3 text-[13px] text-[#b04a4a]">{error}</p> : null}

        {/* Clerk-ийн бот хамгаалалт (CAPTCHA) энд гарч ирнэ. */}
        <div id="clerk-captcha" className="mt-3" />

        <button
          type="submit"
          disabled={!ready || !identifierValid || busy}
          className="mt-3 w-full rounded-[14px] bg-[#2f2420] px-6 py-4 text-[16px] font-medium text-white transition hover:bg-[#6e4f45] disabled:cursor-not-allowed disabled:bg-[#c9bfb8]"
        >
          {busy ? "Илгээж байна…" : "Үргэлжлүүлэх"}
        </button>
      </form>

      <div className="mt-6">
        <Divider />
      </div>

      <div className="mt-6 space-y-3">
        <button type="button" disabled={busy} onClick={() => continueWithOAuth("oauth_facebook")} className={outlineButtonClass}>
          <FacebookIcon />
          <span className="flex-1 text-center">Facebook-р нэвтрэх</span>
        </button>
        <button type="button" disabled={busy} onClick={() => continueWithOAuth("oauth_google")} className={outlineButtonClass}>
          <GoogleIcon />
          <span className="flex-1 text-center">Google-р нэвтрэх</span>
        </button>
      </div>

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
