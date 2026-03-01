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
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const Navbar = () => {
    const { token, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-6 flex justify-between items-center pointer-events-auto bg-transparent">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">


                <span className="text-lg font-medium tracking-tight text-white group-hover:text-indigo-400 transition-colors glitch-target flex items-center gap-2">
                    <img src="/logo.png" alt="MetaWorld" className="w-10 h-10" />
                    MetaWorld
                </span>
            </Link>

            {/* Middle Nav */}
            <nav className="hidden md:flex items-center gap-1 glass-panel p-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                <a href="/#resources" className="px-5 py-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                    Features
                </a>
                <a href="/#how-it-works" className="px-5 py-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                    How It Works
                </a>
                <a href="/#use-cases" className="px-5 py-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                    Use Cases
                </a>
            </nav>

            {/* Right side - Auth / Profile */}
            <div className="flex items-center gap-4">
                {!token ? (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="px-4 py-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                            Sign In
                        </Link>
                        <Link to="/signup" className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25">
                            <span className="text-xs font-semibold text-white">
                                Get Started
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative h-10 w-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md hover:border-indigo-500/50 transition-colors duration-300 flex items-center justify-center overflow-hidden">
                                    {user?.avatarId ? (
                                        <img
                                            src={`/avatar_thumbnail/${user.avatarId}.png`}
                                            alt={user.userName || "User"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User2Icon className="h-5 w-5 text-zinc-400" />
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-zinc-950 border-white/10 text-zinc-300" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">
                                            {user?.userName || "User"}
                                        </p>
                                        {user?.email && (
                                            <p className="text-xs leading-none text-zinc-500">
                                                {user?.email}
                                            </p>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem
                                    className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </header >
    );
};

export default Navbar;
