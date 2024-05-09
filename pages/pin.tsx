import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import MountainIcon from "@/components/MountainIcon";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import React from "react";

export default function Pin() {
    return (
        <>
            <header className="flex h-16 w-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
                        <MountainIcon className="h-6 w-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <nav className="hidden gap-6 text-sm font-medium md:flex">
                        <Link className="hover:underline hover:underline-offset-4" href="/">
                            Home
                        </Link>
                        <Link className="hover:underline hover:underline-offset-4" href="/privacy-policy">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full" size="icon" variant="ghost">
                            <Image
                                alt="Avatar"
                                className="rounded-full"
                                height="32"
                                quality={100}
                                src="https://proclad-construction.vercel.app/api/v1/avatar/1"
                                style={{
                                    aspectRatio: "32/32",
                                    objectFit: "cover",
                                }}
                                width="32"
                            />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Signed in as Unkn0wn</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href="/pin">Pin</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="#">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href="#">Login in</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex h-screen items-center justify-center">
                <div className="w-full max-w-md space-y-4 rounded bg-[#0e0e0f] p-6 shadow-lg dark:bg-[#0e0e0f]">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Authenticate with PIN</h1>
                        <p className="text-gray-500 dark:text-gray-400">Enter the 6-digit PIN code to access the admin
                            dashboard.</p>
                    </div>
                    <form className="space-y-4 flex flex-col items-center justify-center">
                        <InputOTP maxLength={6}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0}/>
                                <InputOTPSlot index={1}/>
                                <InputOTPSlot index={2}/>
                                <InputOTPSlot index={3}/>
                                <InputOTPSlot index={4}/>
                                <InputOTPSlot index={5}/>
                            </InputOTPGroup>
                        </InputOTP>
                        <Button className="w-full" type="submit">
                            Authenticate
                        </Button>
                    </form>
                </div>
            </main>
        </>
    )
}