import { getSession } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EmailSignIn } from "./email-signin";
import { GithubSignIn } from "./github-signin";
import { GoogleSignIn } from "./google-signin";

const SuspenseFallback = () => {
  return (
    <div className="h-12 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
  );
};

export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  // Get parameters from query
  const callbackUrl = (searchParams.callbackUrl as string) || "/";

  return (
    <>
      <Image
        alt="market.dev logo"
        width={64}
        height={64}
        className="relative mx-auto size-10"
        src="/gw-logo-nav.png"
      />
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tightish dark:text-white">
        Login to market.dev
      </h1>
      <p className="mt-3 text-center text-sm text-stone-500 dark:text-stone-400">
        All-in-one business tools, built for developers.
      </p>

      <div className="mx-auto mt-6 flex w-full max-w-xs flex-col gap-2">
        <Suspense fallback={<SuspenseFallback />}>
          <GithubSignIn callbackUrl={callbackUrl} />
        </Suspense>
        <Suspense fallback={<SuspenseFallback />}>
          <GoogleSignIn callbackUrl={callbackUrl} />
        </Suspense>
        <Suspense fallback={<SuspenseFallback />}>
          <EmailSignIn callbackUrl={callbackUrl} />
        </Suspense>
      </div>
    </>
  );
}
