export type AreaComumType = {
    id: string
    dias_de_funcionamento: string[]
    nome: string
    descricao: string
    capacidade_de_pessoas: number
    necessita_reserva: boolean
    permite_convidados: boolean
    possui_taxa_de_utilizacao: boolean
    permite_reserva_a_inadimplente: boolean
    possui_checklist_de_entrada: boolean
    possui_checklist_de_saida: boolean
    pertence_a: number
    valor_da_taxa_de_utilizacao: string | null
}

export type ItemDeAreaComumType = {
    id: string
    data_de_aquisicao: string
    descricao: string
    marca: string
    modelo: string
    pertence_a: number
    quantidade: number
    valor_unitario: string
}

export type ArquivoDeRegraDeAreaComumType = {
    id: string
    descricao: string
    data_de_criacao: string
    is_ativo: boolean
    file_of_rules: string
    pertence_a: number
    criado_por: number
}

export type HistoricoDeValorDeUtilizacaoType = {
    area_comum: number
    author: number
    created_at: string
    id: string
    tipo_de_taxa_referencial: number
    valido_desde: string
    valor: string
}

export type TipoDeTaxaReferencialType = {
    id: string
    nome: string
    descricao: string
}

export type PeriodoDeReservaDeAreaComumType = {
    id: string
    is_dia_inteiro: boolean
    horario_inicio: string
    horario_termino: string
    pertence_a: number
}
