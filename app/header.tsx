"use client";

import { Music2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { signIn, signOut } from "next-auth/react";
import type { User } from "next-auth";

export function Header(props: { user: User | null }) {
  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4 flex-1">
        <Link href="/" className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl border-transparent">
            <Music2 className="w-6 h-6 text-purple-500" />
          </div>
        </Link>
        <SearchBar />
      </div>

      {props.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-25" />
              <Avatar className="h-10 w-10 border-2 border-purple-100">
                <AvatarImage src={props.user?.image ?? ""} alt="Profile" />
                <AvatarFallback>
                  {props.user?.name
                    ?.split(" ")
                    .map((name) => name.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-2" align="end">
            <div className="flex items-center justify-start gap-3 p-2 mb-1">
              <Avatar className="h-10 w-10 border-2 border-purple-100">
                <AvatarImage src={props.user?.image ?? ""} alt="Profile" />
                <AvatarFallback>
                  {props.user?.name
                    ?.split(" ")
                    .map((name) => name.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {props.user?.name}
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  {props.user?.email}
                </p>
              </div>
            </div>
            {/* <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="rounded-md focus:bg-purple-50 cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4 text-purple-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-md focus:bg-purple-50 cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-purple-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-md focus:bg-purple-50 cursor-pointer">
              <Bell className="mr-2 h-4 w-4 text-purple-500" />
              <span>Notifications</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="rounded-md focus:bg-red-50 cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button type="button" onClick={() => signIn("spotify")}>
          Sign in
        </Button>
      )}
    </header>
  );
}
