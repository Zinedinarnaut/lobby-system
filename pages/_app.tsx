// Import necessary dependencies and components
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import GridPattern from "@/components/magicui/grid-pattern";
import { SWRConfig } from 'swr'
import NextNProgress from 'nextjs-progressbar';

// Define the App component
export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
      <SWRConfig
          value={{
            refreshInterval: 40000,
            revalidateOnFocus: false,
          }}
      >
        <NextNProgress
            options={{
              showSpinner: true,
            }}
            color="#F472B6"
            startPosition={0.1}
            stopDelayMs={100}
            height={3}
            showOnShallow={false}
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Component {...pageProps} />
        </ThemeProvider>
        <Toaster richColors theme="dark" closeButton />
        <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            className={
              "-z-10 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)] "
            }
        />
      </SWRConfig>
  );
}