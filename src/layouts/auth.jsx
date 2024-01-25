import { Routes, Route } from "react-router-dom";
import useRoutes from "@/useRoutes";
import {
} from "@heroicons/react/24/solid";



export function Auth() {

  const {routes} = useRoutes()

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
