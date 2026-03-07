import { ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path data-slot="logo-logo-mark-shadow" d="M12 16H4V8H12V16Z" fill="var(--icon-weak-base)" />
      <path data-slot="logo-logo-mark-o" d="M12 4H4V16H12V4ZM16 20H0V0H16V20Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 80H20V40H60V80Z" fill="var(--icon-base)" />
      <path d="M60 20H20V80H60V20ZM80 100H0V0H80V100Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 234 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g>
        <path d="M0 6H6V36H0V6Z" fill="var(--icon-base)" />
        <path d="M18 6H24V36H18V6Z" fill="var(--icon-base)" />
        <path d="M6 24H18V30H6V24Z" fill="var(--icon-weak-base)" />
        <path d="M30 0H36V30H54V36H30V0Z" fill="var(--icon-base)" />
        <path d="M36 24H48V30H36V24Z" fill="var(--icon-weak-base)" />
        <path d="M60 12H66V36H60V12Z" fill="var(--icon-base)" />
        <path d="M78 12H84V36H78V12Z" fill="var(--icon-base)" />
        <path d="M66 6H78V12H66V6Z" fill="var(--icon-base)" />
        <path d="M66 24H78V30H66V24Z" fill="var(--icon-base)" />
        <path d="M66 18H78V24H66V18Z" fill="var(--icon-weak-base)" />
        <path d="M90 6H96V36H90V6Z" fill="var(--icon-base)" />
        <path d="M96 6H108V12H96V6Z" fill="var(--icon-base)" />
        <path d="M96 30H108V36H96V30Z" fill="var(--icon-base)" />
        <path d="M108 12H114V30H108V12Z" fill="var(--icon-base)" />
        <path d="M96 18H108V24H96V18Z" fill="var(--icon-weak-base)" />
        <path d="M144 30H126V18H144V30Z" fill="var(--icon-weak-base)" />
        <path d="M144 12H126V30H144V36H120V6H144V12Z" fill="var(--icon-strong-base)" />
        <path d="M168 30H156V18H168V30Z" fill="var(--icon-weak-base)" />
        <path d="M168 12H156V30H168V12ZM174 36H150V6H174V36Z" fill="var(--icon-strong-base)" />
        <path d="M198 30H186V18H198V30Z" fill="var(--icon-weak-base)" />
        <path d="M198 12H186V30H198V12ZM204 36H180V6H198V0H204V36Z" fill="var(--icon-strong-base)" />
        <path d="M234 24V30H216V24H234Z" fill="var(--icon-weak-base)" />
        <path d="M216 12V18H228V12H216ZM234 24H216V30H234V36H210V6H234V24Z" fill="var(--icon-strong-base)" />
      </g>
    </svg>
  )
}
