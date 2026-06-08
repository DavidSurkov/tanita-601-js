import { NavLink, Navigate, Route, Routes } from "react-router";
import { DashboardPage } from "./components/pages/DashboardPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { UserPage } from "./components/pages/UserPage";
import { Stack } from "./components/wrappers/Stack";
import { Container } from "./components/wrappers/Container";

const navLinkClassName = ({ isActive }: { isActive: boolean }) => {
  const activeClassName = "border-primary-border bg-primary-soft text-primary";
  const inactiveClassName =
    "border-border bg-surface text-text-muted hover:bg-surface-muted hover:text-text";

  return [
    "inline-flex min-h-10 items-center rounded-[10px] border px-3 text-sm font-semibold tracking-normal transition",
    isActive ? activeClassName : inactiveClassName,
  ].join(" ");
};

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <header className="border-b border-border bg-surface p-5">
        <Container className="py-4 sm:py-5" size="lg">
          <Stack gap="md">
            <nav
              aria-label="Primary"
              className="flex gap-2 overflow-x-auto pb-1"
            >
              <NavLink className={navLinkClassName} to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className={navLinkClassName} to="/settings">
                Settings
              </NavLink>
            </nav>
          </Stack>
        </Container>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-8 lg:py-8">
        <Container size="lg">
          <Routes>
            <Route element={<DashboardPage />} path="/dashboard" />
            <Route element={<UserPage />} path="/users/:userId" />
            <Route element={<SettingsPage />} path="/settings" />
            <Route element={<Navigate replace to="/dashboard" />} path="/" />
            <Route element={<Navigate replace to="/dashboard" />} path="*" />
          </Routes>
        </Container>
      </main>
    </div>
  );
}
