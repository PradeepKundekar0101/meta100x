import { useAppSelector, useAppDispatch } from "@/store/hooks";
import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/store/slices/authSlice";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <div className="text-2xl font-bold tracking-tighter">
              Meta<span className="text-primaryBlue">100x</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {!token ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primaryBlue hover:bg-primaryBlue/90 text-white"
                >
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild className="hidden md:flex">
                  <Link to="/spaces">My Spaces</Link>
                </Button>

                {/* <Button
                  asChild
                  className="bg-primaryBlue hover:bg-primaryBlue/90 text-white gap-2 shadow-sm"
                >
                  <Link to="/createroom">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Space</span>
                    <span className="sm:hidden">Create</span>
                  </Link>
                </Button> */}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 border border-slate-200">
                        {user?.avatarId && (
                          <AvatarImage
                            src={`/avatar_thumbnail/${user.avatarId}.png`}
                            alt={user.userName || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-slate-100">
                          <User2Icon className="h-5 w-5 text-slate-500" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.userName || "User"}
                        </p>
                        {user?.email && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-10 min-h-screen">
        <div className="container mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default RootLayout;
