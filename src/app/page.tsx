import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-72 sm:max-w-sm gap-16">
          <CardHeader className="gap-2">
            <CardTitle className="text-center text-2xl">
              ToneBook
            </CardTitle>
            <CardDescription className="text-center">
              Your one-stop for song tracking, gear management, and preset customization.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Link className="w-full" href="/login">
              <Button className="w-full">
                Log In
              </Button>
            </Link>
            <Link className="w-full" href="/signup">
              <Button className="w-full">
                Create an Account
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
