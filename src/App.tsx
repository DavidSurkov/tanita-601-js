import { NavLink, Navigate, Route, Routes } from "react-router";
import { HomePage } from "./components/pages/HomePage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { UserPage } from "./components/pages/UserPage";
import { Stack } from "./components/wrappers/Stack";
import { Container } from "./components/wrappers/Container";
import { HomeIcon, SettingsIcon } from "./components/ui/icons/Navigation";

const navLinkClassName = ({ isActive }: { isActive: boolean }) => {
  const activeClassName = "border-primary-border bg-primary-soft text-primary";
  const inactiveClassName =
    "border-border bg-surface text-text-muted hover:bg-surface-muted hover:text-text";

  return [
    "inline-flex size-11 items-center justify-center rounded-[10px] border transition",
    isActive ? activeClassName : inactiveClassName,
  ].join(" ");
};

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <header className="border-b border-border bg-surface p-5">
        <Container className="py-4 sm:py-5" size="lg">
          <Stack>
            <nav
              aria-label="Primary"
              className="flex gap-2 overflow-x-auto pb-1"
            >
              <NavLink
                aria-label="Home"
                className={navLinkClassName}
                title="Home"
                to="/home"
              >
                <HomeIcon />
              </NavLink>
              <NavLink
                aria-label="Settings"
                className={navLinkClassName}
                title="Settings"
                to="/settings"
              >
                <SettingsIcon />
              </NavLink>
            </nav>
          </Stack>
        </Container>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-8 lg:py-8">
        <Container size="lg">
          <Routes>
            <Route element={<HomePage />} path="/home" />
            <Route element={<UserPage />} path="/users/:userId" />
            <Route element={<SettingsPage />} path="/settings" />
            <Route element={<Navigate replace to="/home" />} path="/" />
            <Route element={<Navigate replace to="/home" />} path="*" />
          </Routes>
        </Container>
      </main>
    </div>
  );
}
