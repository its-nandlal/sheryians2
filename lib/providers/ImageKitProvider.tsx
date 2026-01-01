"use client"

import { ImageKitProvider as IKProvider } from "@imagekit/next"

export default function ImageKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <IKProvider
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string}
        >
            {children}
        </IKProvider>
    )
}
