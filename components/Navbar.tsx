"use client";

import Link from "next/link";

import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Moon, Sun, Settings, Users, LogOut, LogIn } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";


export const AdminNavbar = () => {
  const { user, logOut, checkIfUserIsSuperAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <nav className="flex bg-white drop-shadow-xl p-5 justify-between dark:bg-[#080E1D]">
      <div className="flex gap-5">
        <Image
          src={uitmLogo}
          width={70}
          alt="UITM Logo"
          priority
        />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/admin/home" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Event
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Help
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <Link href="/club" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Club
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <Link href="/verify" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Verify Certificate
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {user && checkIfUserIsSuperAdmin(user) && (
              <NavigationMenuItem>
                <Link href="/admin/manage" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Users className="w-4 h-4 mr-2" />
                    Manage Admins
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            
            <NavigationMenuItem>
              <button
                onClick={() =>
                  theme === "dark" ? setTheme("light") : setTheme("dark")
                }
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {theme === "dark" ? <Sun /> : <Moon />}
                </NavigationMenuLink>
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex gap-1">
        <Avatar>
          {user ? (
            <AvatarImage src={user.photoURL || undefined} alt="guest" />
          ) : (
            <AvatarFallback>G</AvatarFallback>
          )}
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button title="User Menu">
              <ChevronDown />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
      {user ? (
        // Logged in user menu items
        <>
          {checkIfUserIsSuperAdmin(user) && (
            <DropdownMenuItem>
              <Link href="/admin/manage" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Admin Settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={logOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </>
      ) : (
        // Guest menu items
        <DropdownMenuItem>
          <Link href="admin/login" className="flex items-center">
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export const GuestNavbar = () => {
  const { user, logOut, checkIfUserIsAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <nav className="flex bg-white drop-shadow-xl p-5 justify-between dark:bg-[#080E1D]">
      <div className="flex gap-5">
        <Image
          src={uitmLogo}
          width={70}
          alt="UITM Logo"
          priority
        />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/verify" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Verify Certificate
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Help
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <button
                onClick={() =>
                  theme === "dark" ? setTheme("light") : setTheme("dark")
                }
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {theme === "dark" ? <Sun /> : <Moon />}
                </NavigationMenuLink>
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex gap-1">
        {user ? (
          <>
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt="@blurridge" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button title="User Menu">
                  <ChevronDown />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>
    </nav>
  );
};
