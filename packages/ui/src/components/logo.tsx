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
      viewBox="0 0 264 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g>
        <path d="M18 30H6V18H18V30Z" fill="var(--icon-weak-base)" />
        <path d="M18 12H6V30H18V12ZM24 36H0V6H24V36Z" fill="var(--icon-base)" />
        <path d="M30 6H36V24H42V30H36V36H30V6Z" fill="var(--icon-base)" />
        <path d="M48 6H54V36H48V30H42V24H48V6Z" fill="var(--icon-base)" />
        <path d="M42 24H48V30H42V24Z" fill="var(--icon-weak-base)" />
        <path d="M60 6H66V30H84V36H60V6Z" fill="var(--icon-base)" />
        <path d="M66 24H78V30H66V24Z" fill="var(--icon-weak-base)" />
        <path d="M90 12H96V36H90V12Z" fill="var(--icon-base)" />
        <path d="M108 12H114V36H108V12Z" fill="var(--icon-base)" />
        <path d="M96 6H108V12H96V6Z" fill="var(--icon-base)" />
        <path d="M96 24H108V30H96V24Z" fill="var(--icon-base)" />
        <path d="M96 18H108V24H96V18Z" fill="var(--icon-weak-base)" />
        <path d="M120 6H126V36H120V6Z" fill="var(--icon-base)" />
        <path d="M126 6H138V12H126V6Z" fill="var(--icon-base)" />
        <path d="M126 30H138V36H126V30Z" fill="var(--icon-base)" />
        <path d="M138 12H144V30H138V12Z" fill="var(--icon-base)" />
        <path d="M126 18H138V24H126V18Z" fill="var(--icon-weak-base)" />
        <path d="M174 30H156V18H174V30Z" fill="var(--icon-weak-base)" />
        <path d="M174 12H156V30H174V36H150V6H174V12Z" fill="var(--icon-strong-base)" />
        <path d="M198 30H186V18H198V30Z" fill="var(--icon-weak-base)" />
        <path d="M198 12H186V30H198V12ZM204 36H180V6H204V36Z" fill="var(--icon-strong-base)" />
        <path d="M228 30H216V18H228V30Z" fill="var(--icon-weak-base)" />
        <path d="M228 12H216V30H228V12ZM234 36H210V6H228V0H234V36Z" fill="var(--icon-strong-base)" />
        <path d="M264 24V30H246V24H264Z" fill="var(--icon-weak-base)" />
        <path d="M246 12V18H258V12H246ZM264 24H246V30H264V36H240V6H264V24Z" fill="var(--icon-strong-base)" />
      </g>
    </svg>
  )
}
