import { CSSObject } from '@emotion/react'

interface MyTheme {}

declare module 'react' {
    interface Attributes {
       css?: any;
    }
}