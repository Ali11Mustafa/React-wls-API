import { useState, useEffect } from 'react';
import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import Roles from "./pages/dashboard/roles";
import Users from "./pages/dashboard/users";
import { SignIn } from "@/pages/auth";
import ViewRole from "./pages/dashboard/viewRole";

const icon = {
  className: "w-5 h-5 text-inherit",
};


const useRoutes = () => {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  
  
  useEffect(() => {
    const savedUser = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));    setIsUserAdmin(savedUser?.role_id === 1);
  }, []);

  const routes = [
    {
      layout: "dashboard",
      pages: [
        {
          icon: <HomeIcon {...icon} />,
          name: "dashboard",
          path: "/home",
          element: <Home />,
          hide: false,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: "users",
          path: "/users",
          element: <Users />,
          hide: !isUserAdmin,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: "roles",
          path: "/roles",
          element: <Roles />,
          hide: false,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: "view role",
          path: "/roles/:id",
          element: <ViewRole />,
          hide: true,
        },
      ],
    },
    {
      title: "",
      layout: "auth",
      pages: [
        {
          icon: <ServerStackIcon {...icon} />,
          name: "sign in",
          path: "/sign-in",
          element: <SignIn />,
          hide: true,
        },
      ],
    },
  ];

  return {routes};
};

export default useRoutes;
