declare module '*.scss' {
    const content: { [className: string]: string }
    export default content
}

declare interface CSSStyleDeclaration {
    overscrollBehavior: string
}