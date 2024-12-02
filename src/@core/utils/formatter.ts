import moment from 'moment'
import Workdays from './workdays'

moment.updateLocale('pt-br', {
    months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
    monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
    monthsParseExact: true,
    weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
    weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
    weekdaysMin: 'do_2ª_3ª_4ª_5ª_6ª_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
    },
    calendar: {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            const self = this as any
            return self.day() === 0 || self.day() === 6 ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT'
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: 'em %s',
        past: 'há %s',
        s: 'poucos segundos',
        m: 'um minuto',
        mm: '%d minutos',
        h: 'uma hora',
        hh: '%d horas',
        d: 'um dia',
        dd: '%d dias',
        M: 'um mês',
        MM: '%d meses',
        y: 'um ano',
        yy: '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (number) {
        return number + 'º'
    },
    meridiemParse: /AM|PM/,
    isPM: function (input) {
        return input.charAt(0) === 'P'
    },
    meridiem: function (hours) {
        return hours < 12 ? 'AM' : 'PM'
    },
    week: {
        dow: 0,
        doy: 4
    }
})

moment.locale('pt-br')

const formatFunctions = {
    date: (date: string) => {
        if (!date) return '-'
        return moment(date).format('DD/MM/YYYY')
    },
    currency: (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100)
    },
    timeAgo: (date: string | Date) => {
        return moment(date).fromNow()
    },
    relativeTime: (date: string | Date) => {
        return moment(date).calendar()
    },
    relativeAgoTime: (date: string | Date | null) => {
        if (!date) return '-'

        if (moment(date).isBefore(moment().subtract(1, 'day'))) {
            return moment(date).calendar()
        }

        return moment(date).fromNow()
    },
    fileSize: (size: number) => {
        if (size < 1024) {
            return `${size} B`
        }
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`
    },
    workingWeekDays: (days: string) => {
        return new Workdays(days).getAbbreviatedDaysByBinary().toString()
    },
    boolean: (value: boolean) => {
        return value ? 'Sim' : 'Não'
    },
    competence: (competence: number) => {
        return moment(competence.toString(), 'YYYYMM').format('MM/YYYY')
    }
}

export type FormatType = keyof typeof formatFunctions
export type FormatTypeValue = Parameters<(typeof formatFunctions)[FormatType]>[0]
export type FormatTypeReturn = ReturnType<(typeof formatFunctions)[FormatType]>

export default function formatter<T extends FormatType>(formatType: T): (value: FormatTypeValue) => FormatTypeReturn {
    const fun = formatFunctions[formatType] as (value: FormatTypeValue) => FormatTypeReturn

    return (value: Parameters<(typeof formatFunctions)[T]>[0]) => fun(value)
}
