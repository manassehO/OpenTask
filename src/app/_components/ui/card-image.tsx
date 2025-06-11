import * as React from "react"
import { cn } from "@/lib/utils"

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("w-full h-48 object-cover rounded-t-lg", className)}
      {...props}
    />
  )
)
CardImage.displayName = "CardImage"

export { CardImage } 