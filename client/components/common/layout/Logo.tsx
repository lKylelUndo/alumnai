import Image from "next/image"

const sizeMap = {
  sm: { className: "h-10 w-auto", sizes: "40px" },
  md: { className: "h-14 w-auto", sizes: "56px" },
} as const

type LogoSize = keyof typeof sizeMap

interface LogoProps {
  size?: LogoSize
  priority?: boolean
  className?: string
}

const Logo = ({ size = "sm", priority = false, className = "" }: LogoProps) => {
  const { className: sizeClass, sizes } = sizeMap[size]

  return (
    <Image
      src="/logo/logoalumnaiv3.png"
      alt="alumnAI"
      width={226}
      height={237}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      className={`${sizeClass} shrink-0 object-contain ${className}`.trim()}
    />
  )
}

export default Logo
