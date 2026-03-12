import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
  /** Mission layout: 3 cols, 4 rows — card 1 wide, 2 square, 3–4 stacked left, 5 tall right, 6 full width */
  variant?: "default" | "mission"
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  description: string
  className: string
  /** Optional: when omitted, card renders title + subtitle only (no icon/cta) */
  background?: ReactNode
  Icon?: React.ElementType
  href?: string
  cta?: string
}

/** Grid container for bento cards. Use variant="mission" for the 6-card wireframe layout. */
const BentoGrid = ({
  children,
  className,
  variant = "default",
  ...props
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4",
        variant === "default" && "auto-rows-[22rem] grid-cols-3",
        variant === "mission" &&
          // Mobile: single column stacked cards.
          // md+: three-row mission layout with custom row heights:
          // row 1 = base, row 2 = 2x, row 3 = 1.5x.
          "grid-cols-1 auto-rows-auto md:grid-cols-3 md:grid-rows-[minmax(15rem,1.5fr)_minmax(20rem,2fr)_minmax(15rem,1.5fr)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Mission layout per wireframe on md+ screens.
 * - Mobile (<740px): each card is full-width, stacked vertically (simple list).
 * - md+: row1 [wide|square], row2–3 [stacked left|tall right], row4 full width.
 */
export const MISSION_BENTO_CLASSES = [
  // 1: wide top-left on md+, simple full-width on mobile
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  // 2: square top-right on md+, second full-width card on mobile
  "col-span-1 row-span-1 md:col-span-1 md:row-span-1 md:col-start-3",
  // 3: middle-left (stacked top) on md+, third full-width card on mobile
  "col-span-1 row-span-1 md:col-span-1 md:row-span-1 md:row-start-2 md:col-start-1",
  // 4: bottom-left (stacked below 3) on md+, fourth full-width card on mobile
  "col-span-1 row-span-1 md:col-span-1 md:row-span-1 md:row-start-3 md:col-start-1",
  // 5: tall right (cols 2–3, rows 2–3) on md+, fifth full-width card on mobile
  "col-span-1 row-span-1 md:col-span-2 md:row-span-2 md:col-start-2 md:row-start-2",
  // 6: full width bottom on all screen sizes
  "col-span-1 row-span-1 md:col-span-3 md:row-span-1 md:row-start-4",
] as const

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  const hasCta = href != null && cta != null
  const hasIcon = Icon != null
  const hasBackground = background != null

  return (
    <div
      key={name}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-xl min-h-[10rem]",
        // light styles
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
        className
      )}
      {...props}
    >
      {hasBackground && (
        <div className="pointer-events-none absolute inset-0 z-0">
          {background}
        </div>
      )}
      <div className="relative z-10 p-4">
        <div
          className={cn(
            "pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300",
            hasIcon && "lg:group-hover:-translate-y-10"
          )}
        >
          {hasIcon && (
            <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
          )}
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            {name}
          </h3>
          <p className="max-w-lg text-neutral-400">{description}</p>
        </div>

        {hasCta && (
          <>
            <div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
              <Button
                variant="link"
                size="sm"
                className="pointer-events-auto p-0"
                render={<a href={href} />}
                nativeButton={false}
              >
                {cta}
                <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
            <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
              <Button
                variant="link"
                size="sm"
                className="pointer-events-auto p-0"
                render={<a href={href} />}
                nativeButton={false}
              >
                {cta}
                <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" />
    </div>
  )
}

export { BentoCard, BentoGrid }
