// ** Types
import { Key } from 'react'

export type UhabType = {
    id: number
    nome: string
    pertence_a: number
}

export type Agrupamento = {
    id: Key
    nome: string
    descricao: string
    pertence_a: Key
    tipo_de_agrupamento: {
        id: number
        nome: string
    }
}
export type TipoDeResidencialType = {
    id: number
    nome: string
}

export type ModeloDePlantaType = {
    id: number
    nome: string
    fracao_ideal: number
}

export type ResidencialType = {
    id: number
    nome: string
    descricao: string
    number_de_quartos: number
    numero_de_banheiros: number
    metros_quadrados: string
    pertence_a: UhabType
    tipo_de_residencial: TipoDeResidencialType
    _pertence_a__tipo_de_agrupamento: string | null
    modelo_de_planta: ModeloDePlantaType | null
    fracao_ideal: number
}

export type ContatosType = {
    _tipo_de_contato__descricao: string
    id: number
    descricao: string
    pertence_a: Key
    tipo_de_contato: Key
}

export type ProprietarioType = {
    id: Key
    contatos: ContatosType[]
    nome: string
    cpf: string
    data_de_nascimento: Date
    imagem: string
    endereco: Key[]
    email: string
}

export type MoradorType = {
    id: Key
    contatos: ContatosType[]
    nome: string
    cpf: string
    data_de_nascimento: Date
    imagem: string
    endereco: Key[]
    email: string
}

export type FuncionarioType = {
    id: Key
    dias_de_trabalho: string[]
    nome: string
    imagem: string
    data_de_nascimento: string
    cpf: string
    is_ativo: boolean
    pertence_a: Key
    endereco: Key[]
    contatos: ContatosType[]
    email: string
}

export type GaragemType = {
    id: number
    nome: string
    descricao: string
    quantidade_de_vagas: number
    is_vaga_em_uso: boolean
    is_vaga_disponivel_para_locacao: boolean
    is_vaga_gaveta: boolean
    is_vaga_coberta: boolean
    pertence_a: number

    modelo_de_planta: ModeloDePlantaType | null
    fracao_ideal: number | null
}

export type EspecieDeAnimalType = {
    id: number
    nome: string
}

export type RacaDeAnimalType = {
    id: number
    nome: string
    especie: EspecieDeAnimalType
}

export type PorteDeAnimalType = {
    id: number
    nome: string
}

export type PetType = {
    id: number
    nome: string
    imagem: string | null
    especie: EspecieDeAnimalType
    raca: RacaDeAnimalType | null
    porte: PorteDeAnimalType | null
    cor: CorType
    pertence_a: ResidencialType
}

export type CorType = {
    id: number
    nome: string
}

export type FabricanteDeVeiculoType = {
    id: number
    nome: string
}

export type ModeloDeVeiculoType = {
    id: number
    nome: string
    fabricante: FabricanteDeVeiculoType
}

export type VeiculoType = {
    id: number
    placa: string
    ano_de_fabricacao: number
    modelo: ModeloDeVeiculoType
    cor: CorType
    pertence_a: ResidencialType
}
