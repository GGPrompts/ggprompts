import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg"

type SpinnerProps = Omit<React.ComponentProps<typeof Loader2Icon>, "size"> & {
  size?: SpinnerSize
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", sizeClasses[size], className)}
      {...props}
    />
  )
}

export { Spinner }
