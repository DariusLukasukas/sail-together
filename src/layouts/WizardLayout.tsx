import { Outlet } from "react-router-dom";

export default function WizardLayout() {
  return (
    <div className="relative container mx-auto flex min-h-dvh flex-col p-2 md:px-0">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
