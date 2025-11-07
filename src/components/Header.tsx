import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/avatar.png";

const NAVIGATION = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/explore", label: "Explore" },
  { to: "/profile", label: "Profile" },
];

export default function Header() {
  // Used to add the "Add Post" button to the Explore page
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onExplore = pathname.startsWith("/explore");

  const openAddPost = () => {
    navigate({ pathname: "/explore", search: "?addPost=1" });
  };

  return (
    <header className="bg-background sticky top-0 z-50 w-full py-2">
      <div className="relative flex items-center justify-between px-4">
        {/* This is a placeholder to keep it balanced after adding the "Add-Post button, might need cleaning up" */}
        <div className="flex items-center gap-2 invisible">
          <Button variant="outline" size="sm">
            Add Post
          </Button>
          <Avatar className="size-10" />
        </div>

        {/* Center  */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 -translate-x-1/2"
        >
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
                      isActive &&
                        "hover:bg-background text-blue-500 hover:text-blue-500"
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side (Add Post and Avatar) */}
        <div className="flex items-center gap-2">
          {onExplore && (
            <Button onClick={openAddPost} variant="outline" size="sm">
              Add Post
            </Button>
          )}

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
