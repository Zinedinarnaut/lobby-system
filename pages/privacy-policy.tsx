import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import React from "react";

import MountainIcon from "@/components/MountainIcon"


export default function privacyPolicy() {
    return (
        <>
            <header className="flex h-16 w-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
                        <MountainIcon className="h-6 w-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <nav className="hidden gap-6 text-sm font-medium md:flex">
                        <Link className="hover:underline hover:underline-offset-4" href="#">
                            Home
                        </Link>
                        <Link className="hover:underline hover:underline-offset-4" href="#">
                            Products
                        </Link>
                        <Link className="hover:underline hover:underline-offset-4" href="#">
                            Pricing
                        </Link>
                        <Link className="hover:underline hover:underline-offset-4" href="#">
                            About
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
                        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href="#">Your Profile</Link>
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
            <main className="w-full max-w-[800px] mx-auto px-4 md:px-6 py-12 md:py-20">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-white mt-2 text-lg">Last updated: 7/5/2024</p>
                </header>
                <section className="mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Data Collection</h2>
                    <p className="text-white leading-relaxed">
                        We collect certain personal information from you, such as your name, and any
                        other information
                        you provide to us directly. We may also collect information about your usage of our website or
                        services,
                        including your IP address, browser type, and device information it may vary.
                    </p>
                </section>
                <section className="mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Data Usage</h2>
                    <p className="text-white leading-relaxed">
                        We use the information we collect to provide and improve our services, communicate with you, and
                        for other
                        legitimate business purposes. We will not sell or share your personal information with third
                        parties for their
                        own marketing purposes without your consent (We will never give or sell your data).
                    </p>
                </section>
                <section className="mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Data Sharing</h2>
                    <p className="text-white leading-relaxed">
                        We may share your personal information with third-party service providers who assist us in
                        operating our
                        website and delivering our services. These providers are contractually obligated to protect the
                        privacy and
                        security of your data.
                    </p>
                </section>
                <section className="mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Rights</h2>
                    <p className="text-white leading-relaxed">
                        You have the right to access, correct, or delete your personal information. You can also opt-out
                        of certain
                        data processing activities or withdraw your consent at any time. If you have any questions or
                        concerns, please
                        contact us at privacy@araxyso.xyz.
                    </p>
                </section>
            </main>
        </>
    )
}