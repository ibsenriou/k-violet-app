import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type AnimalBreedType = HomespaceBaseModel & {
    description: string
    fk_animal_species: string
}
