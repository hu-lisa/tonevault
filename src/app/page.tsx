import Link from "next/link";

export default async function Home() {

  return (
    <main>
      <div>
        <Link href="/login">
          <span>Log In</span>
        </Link>
      </div>
      <div>
        <Link href="/signup">
          <span>Create an Account</span>
        </Link>
      </div>
    </main>
  );
}
