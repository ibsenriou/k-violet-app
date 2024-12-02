import isNumber from './is-number'

// ** Returns initials from string
export const getInitials = (string: string = '#') => {
    if (string === '' || string === null) {
        return '#'
    }
    if (isNumber(string)) {
        return string
    }
    const words = string.trim().toLocaleUpperCase().split(' ')
    if (words.length === 1) {
        return string.toLocaleUpperCase().charAt(0)
    }
    if (words.length > 2) {
        if (isNumber(words.at(-1)) && !isNumber(words.at(-2))) {
            return words[0].charAt(0) + words.at(-2)?.charAt(0) + words.at(-1)?.charAt(0)
        }
    }
    return words[0].charAt(0) + words.at(-1)?.charAt(0)
}
