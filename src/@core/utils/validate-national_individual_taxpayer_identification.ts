export function getCPFOrCNPJValidationError(_cpfOrCnpj: string): string | null {
    const cpfOrCnpj = _cpfOrCnpj.replace(/\D/g, '')

    if (!cpfOrCnpj) return 'Campo obrigatório!'

    if (cpfOrCnpj.length < 11) return 'CPF deve conter 11 digitos!'
    if (cpfOrCnpj.length > 11 && cpfOrCnpj.length < 14) return 'CNPJ deve conter 14 digitos!'

    if (cpfOrCnpj.length === 11) {
        if (!validateCPF(cpfOrCnpj)) return 'CPF inválido!'
    }

    if (cpfOrCnpj.length === 14) {
        if (!validateCNPJ(cpfOrCnpj)) return 'CNPJ inválido!'
    }

    return null
}

export function validateCPF(cpf: string): boolean {
    let sum = 0
    let remainder

    if (cpf.length !== 11) {
        return false
    }

    if (
        [
            '00000000000',
            '11111111111',
            '22222222222',
            '33333333333',
            '44444444444',
            '55555555555',
            '66666666666',
            '77777777777',
            '88888888888',
            '99999999999'
        ].indexOf(cpf) !== -1
    )
        return false

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) {
        remainder = 0
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false
    }

    sum = 0

    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) {
        remainder = 0
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) {
        return false
    }

    return true
}

export function validateCNPJ(cnpj: string): boolean {
    const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const c = cnpj.replace(/[^\d]/g, '')

    if (c.length !== 14) {
        return false
    }

    if (/0{14}/.test(c)) {
        return false
    }

    let n = 0
    for (let i = 0; i < 12; n += parseInt(c[i]) * b[++i]);

    if (parseInt(c[12]) !== ((n %= 11) < 2 ? 0 : 11 - n)) {
        return false
    }

    n = 0
    for (let i = 0; i <= 12; n += parseInt(c[i]) * b[i++]);
    if (parseInt(c[13]) !== ((n %= 11) < 2 ? 0 : 11 - n)) {
        return false
    }

    return true
}

export function addCPFMask(cpf: string): string {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function addCNPJMask(cnpj: string): string {
    return cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}
