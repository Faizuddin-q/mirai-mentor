import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <main>
    <div className="flex justify-center pb-20">
      <SignIn />
    </div>
  </main>
}
