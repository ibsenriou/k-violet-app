class Workdays {
    static readonly INDEXES = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6
    }

    static readonly DAYS_TRANSLATION = {
        SUNDAY: 'Domingo',
        MONDAY: 'Segunda',
        TUESDAY: 'Terça',
        WEDNESDAY: 'Quarta',
        THURSDAY: 'Quinta',
        FRIDAY: 'Sexta',
        SATURDAY: 'Sábado'
    }

    static readonly ABBREVIATED_DAYS = {
        SUNDAY: 'Dom',
        MONDAY: 'Seg',
        TUESDAY: 'Ter',
        WEDNESDAY: 'Qua',
        THURSDAY: 'Qui',
        FRIDAY: 'Sex',
        SATURDAY: 'Sáb'
    }

    constructor(private binary: string = '0000000') {}

    getValue(day: keyof typeof Workdays.INDEXES) {
        return this.binary[Workdays.INDEXES[day]] === '1'
    }

    setValue(day: keyof typeof Workdays.INDEXES, value: boolean) {
        const index = Workdays.INDEXES[day]
        const binary = this.binary.split('')
        binary[index] = value ? '1' : '0'
        this.binary = binary.join('')

        return new Workdays(this.binary)
    }

    getBinary() {
        return this.binary
    }

    getAbbreviatedDaysByBinary() {
        const days = []
        for (const key in Workdays.INDEXES) {
            const index = Workdays.INDEXES[key as keyof typeof Workdays.INDEXES]
            if (this.binary[index] === '1') {
                days.push(Workdays.ABBREVIATED_DAYS[key as keyof typeof Workdays.ABBREVIATED_DAYS])
            }
        }

        return days
    }
}

export default Workdays
