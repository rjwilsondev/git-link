import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, StarsIcon } from "@hugeicons/core-free-icons";
import { Input } from "~/components/ui/input";
import { AvatarDropdown } from "./avatar-dropdown";

export function Navbar() {
  return (
    <header className="border-border sticky top-0 z-50 w-full border-b bg-gradient-to-b from-taupe-50 to-taupe-200 shadow-sm">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <HugeiconsIcon
            icon={StarsIcon}
            className="text-primary h-6 w-6"
            size={24}
          />
          <span>git-link</span>
        </Link>

        <div className="flex flex-1 items-center justify-center gap-4 md:gap-8">
          <form className="relative hidden w-full max-w-md md:block">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2"
              size={16}
            />
            <Input
              type="search"
              placeholder="Search or jump to..."
              className="bg-muted/40 border-border h-8 pl-9 focus-visible:ring-1"
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
}
