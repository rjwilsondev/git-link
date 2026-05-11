import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, StarsIcon } from "@hugeicons/core-free-icons";
import { Input } from "~/components/ui/input";
import { AvatarDropdown } from "./avatar-dropdown";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-b from-taupe-50 to-taupe-200 shadow-sm">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <HugeiconsIcon icon={StarsIcon} className="w-6 h-6 text-primary" size={24} />
          <span>git-link</span>
        </Link>

        <div className="flex-1 flex items-center gap-4 md:gap-8 justify-center">
          <form className="relative max-w-md w-full hidden md:block">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              size={16}
            />
            <Input
              type="search"
              placeholder="Search or jump to..."
              className="pl-9 h-8 bg-muted/40 border-border focus-visible:ring-1"
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
