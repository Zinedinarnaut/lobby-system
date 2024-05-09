import Link from "next/link"
import { NavigationMenuLink, NavigationMenuItem, NavigationMenuList, NavigationMenu } from "@/components/ui/navigation-menu"
import React, {JSX, SVGProps, useEffect, useState} from "react"
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

export default function Component() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Zinedinarnaut/lobby-system/master/version.txt');
        const data = await response.text();
        if (data) {
          setLatestVersion(data.trim());
        }
      } catch (error) {
        toast.error(`Error fetching latest version: ${error}`);
      }
    };

    fetchLatestVersion();
  }, []);
  return (
      <>
        <header className="sticky top-0 z-50 bg-[#0e0e0f] shadow-sm dark:bg-[#0e0e0f] dark:text-gray-50">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <GamepadIcon className="h-6 w-6"/>
              <span>Game Vault</span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-4">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link className="hover:underline" href="/lobbyCreation">
                      Lobby Creation
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </header>
        <main>
          <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-[#0e0e0f]">
            <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to Game Vault</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover a vast collection of the latest and greatest games. Explore, play, and immerse yourself in
                  the
                  ultimate gaming experience.
                </p>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div
                className="container grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 md:px-6">
              <Link className="group" href="#">
                <div
                    className="overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 dark:bg-gray-800">
                  <img
                      alt="Game Thumbnail"
                      className="aspect-[3/2] w-full object-cover"
                      height="200"
                      src="/placeholder.svg"
                      width="300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Cyberpunk 2077</h3>
                  </div>
                </div>
              </Link>
              <Link className="group" href="#">
                <div
                    className="overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 dark:bg-gray-800">
                  <img
                      alt="Game Thumbnail"
                      className="aspect-[3/2] w-full object-cover"
                      height="200"
                      src="/placeholder.svg"
                      width="300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">The Witcher 3</h3>
                  </div>
                </div>
              </Link>
              <Link className="group" href="#">
                <div
                    className="overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 dark:bg-gray-800">
                  <img
                      alt="Game Thumbnail"
                      className="aspect-[3/2] w-full object-cover"
                      height="200"
                      src="/placeholder.svg"
                      width="300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Red Dead Redemption 2</h3>
                  </div>
                </div>
              </Link>
              <Link className="group" href="#">
                <div
                    className="overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 dark:bg-gray-800">
                  <img
                      alt="Game Thumbnail"
                      className="aspect-[3/2] w-full object-cover"
                      height="200"
                      src="/placeholder.svg"
                      width="300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Elden Ring</h3>
                  </div>
                </div>
              </Link>
              <Link className="group" href="#">
                <div
                    className="overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 dark:bg-gray-800">
                  <img
                      alt="Game Thumbnail"
                      className="aspect-[3/2] w-full object-cover"
                      height="200"
                      src="/placeholder.svg"
                      width="300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">God of War</h3>
                  </div>
                </div>
              </Link>
              <Link className="group" href="#">
                <div
                    className="overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 dark:bg-gray-800">
                  <img
                      alt="Game Thumbnail"
                      className="aspect-[3/2] w-full object-cover"
                      height="200"
                      src="/placeholder.svg"
                      width="300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Horizon Zero Dawn</h3>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </main>
        <footer
            className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Araxyso. All rights reserved.</p>
          <div
              className="flex p-2 flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
            <Button key="1" className="flex items-center space-x-2 bg-transparent" variant="outline">
              <CircleIcon className="h-4 w-4 animate-pulse text-green-500"/>
              {latestVersion && (
                  <span>Latest version: {latestVersion}</span>
              )}
            </Button>
          </div>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/lobbyCreation">
              Lobby Creation
            </Link>
          </nav>
        </footer>
      </>
  )
}

function GamepadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <line x1="6" x2="10" y1="12" y2="12"/>
        <line x1="8" x2="8" y1="10" y2="14"/>
        <line x1="15" x2="15.01" y1="13" y2="13"/>
        <line x1="18" x2="18.01" y1="11" y2="11"/>
        <rect width="20" height="12" x="2" y="6" rx="2"/>
      </svg>
  )
}

function CircleIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"/>
      </svg>
  )
}