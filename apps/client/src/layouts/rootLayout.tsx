import { useAppSelector } from "@/store/hooks";
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
import { PlusCircle, User2Icon } from "lucide-react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const {  token } = useAppSelector((state) => state.auth);

  return (
    <div className=" ">
      <nav className="fixed px-10 top-0 bg-white w-full h-12 mb-24 flex justify-between items-center">
        <div>
          Meta<span className=" font-semibold text-primaryBlue">100x</span>
        </div>
        <ul className="flex items-center ">
          {!token ? (
            <>
              <li>
                <Link
                  to={"/login"}
                  className=" bg-primaryBlue text-white px-4 py-2 rounded-md"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to={"/login"}
                  className=" border-primaryBlue border-1 text-primaryBlue px-4 py-2 rounded-md"
                >
                  Create Account
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
             
                <Link
                  className=" flex space-x-3  items-center bg-primaryBlue text-white px-4 py-2 rounded-md"
                  to={"/createroom"}
                >
                 <PlusCircle className=" h-5 w-5 " /><span>
                  Create Space
                  </span> 
                </Link>
              </li>
              <li>
                <Link className="mx-2" to={"/spaces"}>
                  My Spaces
                </Link>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <User2Icon
                      color="#64748b"
                      className=" border-2 rounded-full border-slate-500"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="mt-12 bg-slate-100 px-10">{children}</div>
    </div>
  );
};

export default RootLayout;
