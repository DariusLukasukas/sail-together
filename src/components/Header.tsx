import avatar from "@/assets/avatar.png";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/avatar.png";

interface Navbar {
  to: string;
  label: string;
  end?: boolean;
}

const NAVIGATION: Navbar[] = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/explore", label: "Explore" },
];

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full py-2">
      <div className="flex flex-row items-center">
        <nav aria-label="Primary" className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex list-none gap-0.5">
            {NAVIGATION.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={!!end}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-9 items-center rounded-md px-4 py-2 font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "hover:bg-background text-blue-500 hover:text-blue-500"
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <NavLink to={"/add-listing"}>
            <Button variant={"secondary"}>Add Listing</Button>
          </NavLink>
          <NavLink to={"/profile"}>
            <Avatar className="size-10 select-none">
              <AvatarImage src={avatar} alt="profile avatar" />
              <AvatarFallback>CL</AvatarFallback>
            </Avatar>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
