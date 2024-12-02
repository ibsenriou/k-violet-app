import { HomespaceBaseModel } from '../core/homeSpaceBaseModelTypes'

export type PetType = HomespaceBaseModel & {
    name: string
    image: File | string
    fk_animal_breed: string
    fk_animal_size: string
    fk_animal_color: string
    fk_residential: string
}
