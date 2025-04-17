import type { ThemeEditorPreviewProps } from "@/types/theme"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { lazy, useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize, Minimize, PanelRight, Moon, Sun } from "lucide-react"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip"
import type { Internal, QueuedRequest } from "@/lib/batua/type"
import { useEffect } from "react"

const Login = lazy(() =>
    import("@/components/batua/Login").then((module) => ({
        default: module.Login
    }))
)
const SendCalls = lazy(() =>
    import("@/components/batua/SendCalls").then((module) => ({
        default: module.SendCalls
    }))
)

const onComplete = (_: {
    queueRequest: QueuedRequest
}) => {}

const queueRequest = {
    request: {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_requestAccounts",
        params: [],
        _returnType: "array"
    },
    status: "pending"
} as QueuedRequest

const internal = {
    config: {
        dappName: "Pimlico",
        walletName: "Batua"
    }
} as Internal

const sendCallsRequest = {
    request: {
        id: 2,
        method: "wallet_sendCalls",
        params: [
            {
                version: "1.0",
                from: "0x40eBF87b434701262b68507B6de9F5520ba83851",
                chainId: "0xaa36a7",
                calls: [
                    {
                        to: "0xFC3e86566895Fb007c6A0d3809eb2827DF94F751",
                        data: "0x40c10f1900000000000000000000000040ebf87b434701262b68507b6de9f5520ba838510000000000000000000000000000000000000000000000000000000005f5e100"
                    }
                ]
            }
        ],
        jsonrpc: "2.0"
    },
    status: "pending"
} as QueuedRequest

// const i = Batua.create()
// if(i.internal) {
//     internal = i.internal
// }
// i.destroy()

const ThemePreviewPanel = ({
    styles,
    currentMode,
    isCodePanelOpen,
    onCodePanelToggle
}: ThemeEditorPreviewProps) => {
    const { isFullscreen, toggleFullscreen } = useFullscreen()
    const { theme, toggleTheme } = useTheme()
    const [isLoginFullscreen, setIsLoginFullscreen] = useState(false)
    const [isSendCallsFullscreen, setIsSendCallsFullscreen] = useState(false)

    useEffect(() => {
        if (!isFullscreen) {
            setIsLoginFullscreen(false)
            setIsSendCallsFullscreen(false)
        }
    }, [isFullscreen])

    if (!styles || !styles[currentMode]) {
        return null
    }

    const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX: x, clientY: y } = event
        toggleTheme({ x, y })
    }

    const handleFullscreenToggle = (
        state: boolean,
        dispatch: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        dispatch(!state && !isFullscreen)
        toggleFullscreen()
    }

    return (
        <div
            className={cn(
                "max-h-full flex flex-col",
                isFullscreen && "fixed inset-0 z-50 bg-background p-4"
            )}
        >
            <ScrollArea className="flex flex-col flex-1 p-4">
                {(!isFullscreen || isLoginFullscreen) && (
                    <div
                        className={cn("p-6 mb-6", {
                            "border rounded-lg": !isFullscreen
                        })}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">
                                Login/Signup Preview
                            </h2>
                            <div className="flex items-center gap-0">
                                {isLoginFullscreen && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleThemeToggle}
                                                className="h-8 group"
                                            >
                                                {theme === "light" ? (
                                                    <Sun className="size-4 group-hover:scale-120 transition-all" />
                                                ) : (
                                                    <Moon className="size-4 group-hover:scale-120 transition-all" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Toggle Theme
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleFullscreenToggle(
                                                    isLoginFullscreen,
                                                    setIsLoginFullscreen
                                                )
                                            }
                                            className="h-8 group"
                                        >
                                            {isLoginFullscreen ? (
                                                <Minimize className="size-4 group-hover:scale-120 transition-all" />
                                            ) : (
                                                <Maximize className="size-4 group-hover:scale-120 transition-all" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isLoginFullscreen
                                            ? "Exit full screen"
                                            : "Full screen"}
                                    </TooltipContent>
                                </Tooltip>
                                {!isCodePanelOpen && !isLoginFullscreen && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    onCodePanelToggle(
                                                        !isCodePanelOpen
                                                    )
                                                }
                                                className="h-8 invisible md:visible group"
                                                aria-label="Show Code Panel"
                                            >
                                                <PanelRight className="size-4 group-hover:scale-120 transition-all" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Hide Code Panel
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex justify-center items-center flex-col gap-4">
                                <Login
                                    onComplete={onComplete}
                                    queueRequest={queueRequest}
                                    internal={internal}
                                    dummy={true}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {(!isFullscreen || isSendCallsFullscreen) && (
                    <div
                        className={cn("p-6 mb-6", {
                            "border rounded-lg": !isFullscreen
                        })}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">
                                Sending Transaction
                            </h2>
                            <div className="flex items-center gap-0">
                                {isSendCallsFullscreen && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleThemeToggle}
                                                className="h-8 group"
                                            >
                                                {theme === "light" ? (
                                                    <Sun className="size-4 group-hover:scale-120 transition-all" />
                                                ) : (
                                                    <Moon className="size-4 group-hover:scale-120 transition-all" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Toggle Theme
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleFullscreenToggle(
                                                    isSendCallsFullscreen,
                                                    setIsSendCallsFullscreen
                                                )
                                            }
                                            className="h-8 group"
                                        >
                                            {isSendCallsFullscreen ? (
                                                <Minimize className="size-4 group-hover:scale-120 transition-all" />
                                            ) : (
                                                <Maximize className="size-4 group-hover:scale-120 transition-all" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isSendCallsFullscreen
                                            ? "Exit full screen"
                                            : "Full screen"}
                                    </TooltipContent>
                                </Tooltip>
                                {!isCodePanelOpen && !isSendCallsFullscreen && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    onCodePanelToggle(
                                                        !isCodePanelOpen
                                                    )
                                                }
                                                className="h-8 invisible md:visible group"
                                                aria-label="Show Code Panel"
                                            >
                                                <PanelRight className="size-4 group-hover:scale-120 transition-all" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Hide Code Panel
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex justify-center items-center flex-col gap-4">
                                <SendCalls
                                    onComplete={onComplete}
                                    queueRequest={sendCallsRequest}
                                    internal={internal}
                                    dummy={true}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

export default ThemePreviewPanel
