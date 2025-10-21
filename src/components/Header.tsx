import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatar from "@/assets/avatar.png";

const NAVIGATION = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/explore", label: "Explore" },
  { to: "/profile", label: "Profile" },
];

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full py-2">
      <div className="flex flex-row items-center">
        <div aria-hidden className="sr-only size-10" />

        <nav aria-label="Primary" className="mx-auto">
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

        <NavLink to={"/profile"}>
          <Avatar className="size-10 select-none">
            <AvatarImage src={avatar} alt="profile avatar" />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
        </NavLink>
      </div>
    </header>
  );
}
