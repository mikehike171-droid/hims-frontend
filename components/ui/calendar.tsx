"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames, type DayPickerProps } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
  buttonVariant = "ghost",
  formatters,
  components,
  selected,
  onSelect,
  mode = "single",
  ...props
}: any) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white p-3 border rounded-lg shadow-lg",
        className
      )}
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      captionLayout="label"
      formatters={{
        formatWeekdayName: (date) => {
          const names = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
          return names[date.getDay()]
        },
        ...formatters,
      }}
      classNames={{
        root: cn("w-[280px]", defaultClassNames.root),
        months: cn("flex flex-col relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-2", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 absolute top-0 right-0",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-start h-8 px-1 mb-2",
          defaultClassNames.month_caption
        ),
        caption_label: cn("text-sm font-bold", defaultClassNames.caption_label),
        table: "w-full border-collapse",
        weekdays: cn("flex justify-between mb-1", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-500 w-8 text-center font-normal text-[0.8rem]",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-1 justify-between", defaultClassNames.week),
        day: cn(
          "relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          defaultClassNames.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50"
        ),
        selected: cn(
          "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 rounded-md border-2 border-blue-700 font-bold",
          defaultClassNames.selected
        ),
        today: cn("text-blue-600 font-bold", defaultClassNames.today),
        outside: cn("text-gray-300 opacity-50", defaultClassNames.outside),
        disabled: cn("text-gray-300 opacity-50", defaultClassNames.disabled),
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m18 15-6-6-6 6" /></svg>
            )
          }
          if (orientation === "right") {
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6" /></svg>
            )
          }
          return <span className="sr-only" />
        },
        ...components,
      }}
      footer={
        <div className="flex items-center justify-between mt-4 px-1 pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 font-medium px-2 h-8"
            onClick={() => onSelect?.(undefined, new Date(), { selected: false }, {} as any)}
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 font-medium px-2 h-8"
            onClick={() => onSelect?.(new Date(), new Date(), { selected: true }, {} as any)}
          >
            Today
          </Button>
        </div>
      }
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
