// ** Type Imports
import { Skin, ThemeColor } from '@core/layouts/types'
import PaletteMode from '../PaletteMode'

const DefaultPalette = (mode: PaletteMode, skin: Skin, themeColor: ThemeColor) => {
    // ** Vars
    const lightColor = '0, 0, 0'
    const darkColor = '255, 255, 255'
    const mainColor = mode === 'light' ? lightColor : darkColor

    const primaryGradient = () => {
        if (themeColor === 'primary') {
            return mode === 'light' ? '#000' : '#ffffff' //TODO LARI CORES - '#ffffff' Gradiente dos botões do menu lateral
        } else if (themeColor === 'secondary') {
            return '#9C9FA4'
        } else if (themeColor === 'success') {
            return '#93DD5C'
        } else if (themeColor === 'error') {
            return '#FF8C90'
        } else if (themeColor === 'warning') {
            return '#FFCF5C'
        } else {
            return '#6ACDFF'
        }
    }

    const defaultBgColor = () => {
        if (skin === 'bordered' && mode === 'light') {
            return '#FFF'
        } else if (skin === 'bordered' && mode === 'dark') {
            return '#312D4B'
        } else if (mode === 'light') {
            return '#d9d9d980' //TODO LARI CORES - d9d9d980 cor mais forte do background - Light
        } else return '#1d1d1ded' //TODO LARI CORES - 1d1d1d cor mais forte do background - Dark
    }

    return {
        customColors: {
            dark: `rgb(${darkColor})`,
            main: `rgb(${mainColor})`,
            light: `rgb(${lightColor})`,
            darkBg: '#1d1d1ded', //TODO LARI CORES - Cor mais forte do background - Dark
            lightBg: '#d9d9d980', //TODO LARI CORES - Cor mais forte do background - Light
            primaryGradient: primaryGradient(),
            bodyBg: mode === 'light' ? '#d9d9d980' : '#1d1d1ded', //TODO LARI CORES - Cor mais forte do background
            tableHeaderBg: mode === 'light' ? '#ececec' : '#616161' //TODO LARI CORES - Tab Residencias - Residencial. Tipo de Residencial
        },
        common: {
            black: '#000',
            white: '#FFF'
        },
        mode: mode,
        primary: {
            light: '#9E69FD',
            main: mode === 'light' ? '#000' : '#ffffff', //TODO LARI CORES - Cor do botão de Login
            dark: '#a6a4a4', //TODO LARI CORES - Hover botão de login
            contrastText: mode === 'light' ? '#ffffff' : '#000' //TODO LARI CORES - Cor do botão adicionar agrupamento
        },
        secondary: {
            light: '#9C9FA4',
            main: '#8A8D93',
            dark: '#777B82',
            contrastText: '#FFF'
        },
        success: {
            light: '#6AD01F',
            main: '#56CA00',
            dark: '#4CB200',
            contrastText: '#FFF'
        },
        error: {
            light: '#FF6166',
            main: '#FF4C51',
            dark: '#E04347',
            contrastText: '#FFF'
        },
        warning: {
            light: '#FFCA64',
            main: '#FFB400',
            dark: '#E09E00',
            contrastText: '#FFF'
        },
        info: {
            light: '#32BAFF',
            main: '#16B1FF',
            dark: '#139CE0',
            contrastText: '#FFF'
        },
        grey: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
            A100: '#D5D5D5',
            A200: '#AAAAAA',
            A400: '#616161',
            A700: '#303030'
        },
        text: {
            primary: `rgba(${mainColor})`,
            secondary: `rgba(${mainColor}, 0.68)`,
            disabled: `rgba(${mainColor}, 0.38)`
        },
        divider: `rgba(${mainColor}, 0.12)`,
        background: {
            paper: mode === 'light' ? '#FFF' : '#3c3c3c', //TODO LARI CORES - #3c3c3c' Cor do retangulo do login
            default: defaultBgColor()
        },
        action: {
            active: `rgba(${mainColor}, 0.54)`,
            hover: `rgba(${mainColor}, 0.04)`,
            selected: `rgba(${mainColor}, 0.08)`,
            disabled: `rgba(${mainColor}, 0.3)`,
            disabledBackground: `rgba(${mainColor}, 0.18)`,
            focus: `rgba(${mainColor}, 0.12)`
        }
    }
}

export default DefaultPalette
