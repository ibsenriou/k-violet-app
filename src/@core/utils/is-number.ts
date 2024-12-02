export default function isNumber(value: any): boolean {
    return (typeof value === 'number' && isFinite(value)) || !isNaN(parseFloat(value))
}
