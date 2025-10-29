import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import avatar from "@/assets/avatar.png";
import { Button } from "@/components/ui/Button"; // Import Button
import { useAuth } from "@/hooks/useAuth"; // Import our new mock hook

// Scenario: "Profile" has been REMOVED from this array.
// The avatar is now the only link to the profile.
// { to: "/profile", label: "Profile" },
const NAVIGATION = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/explore", label: "Explore" },
];

export default function Header() {
  // retrieve the currently logged-in user
  const { user } = useAuth();
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((s) => s[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };
  return (
    <header className="bg-background sticky top-0 z-50 w-full py-0.5">
      {/* This could be a much cleaner way to center the navigation.
        - use a container with flexbox.
        - The left/right items have a fixed width (size-10).
        - The nav in the middle uses 'mx-auto' to fill the space
          and center itself perfectly.
           </div><div className="flex flex-row items-center">
        <div aria-hidden className="sr-only size-10" />
      */}
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* 3. Left Spacer (cleaner) */}
        <div className="w-10 flex-shrink-0" aria-hidden="true" />
        {/* Primary Navigation */}
        <nav aria-label="Primary" className="mx-auto">
          <ul className="flex list-none gap-0.5">
            {NAVIGATION.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={!!end}
                  className={
                    ({ isActive }) =>
                      cn(
                        "inline-flex h-9 items-center rounded-md px-4 py-2 font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-accent/50 text-accent-foreground"
                      ) //"hover:bg-background text-blue-500 hover:text-blue-500"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/*  Right Avatar / Login Button */}
        <div className="flex w-10 flex-shrink-0 justify-end">
          {user ? (
            //  If the user exists, show the avatar...
            <NavLink
              // 7. ...linking to their DYNAMIC user ID.
              to={`/profile/${user.id}`}
              // 8. add an active state to the AVATAR itself!
              className={({ isActive }) =>
                cn(
                  "ring-offset-background rounded-full transition-all",
                  // When active, show a blue ring around it.
                  isActive && "ring-2 ring-blue-500 ring-offset-2"
                )
              }
            >
              <Avatar className="size-10 select-none">
                <AvatarImage src={user.avatarUrl} alt="profile avatar" />
                <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
              </Avatar>
            </NavLink>
          ) : (
            // If no user, show a Login button.
            <Button size="sm">Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
/*
        <NavLink to={"/profile"}>
          <Avatar className="size-10 select-none">
            <AvatarImage src={avatar} alt="profile avatar" />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
        </NavLink>
*/
