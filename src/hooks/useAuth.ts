// This is a mock hook to simulate authentication.
// replace this with auth context
import avatar from "@/assets/avatar.png";

export const useAuth = () => {
  // Try changing this to null to see the "Login" button!
  const user = {
    id: "1", // This is the 'userId' your profile page needs!
    name: "Jack Sparrow",
    avatarUrl: avatar,
  };

  // test the logged-out state:
  // const user = null;

  return { user };
};
