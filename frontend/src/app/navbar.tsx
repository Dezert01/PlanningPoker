"use client";

import Link from "next/link";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/utils/useLogout";
import { useUserStore } from "@/stores/user-store";

const Navbar: React.FC = () => {
  const logout = useLogout();
  const user = useUserStore((state) => state.user);

  return (
    <div className="h-20 w-full bg-background2">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link className="h-16" href="/">
            <Logo />
          </Link>
          <span className="text-3xl font-bold text-white">
            Planning Poker Tool
          </span>
        </div>
        {user ? (
          <Button type="button" onClick={logout}>
            Logout
          </Button>
        ) : 
          (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
