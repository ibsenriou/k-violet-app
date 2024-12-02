import { AnimalBreedType } from '@typesApiMapping/apps/pets/animalBreedTypes'
import { AnimalSizeType } from '@typesApiMapping/apps/pets/animalSizeTypes'
import { AnimalSpeciesType } from '@typesApiMapping/apps/pets/animalSpeciesTypes'
import { PetType } from '@typesApiMapping/apps/pets/petTypes'
import { createUrl } from './Url'

export const PetsService = {
    animal_breed: createUrl<null, AnimalBreedType[]>('/pets/animal_breed/'),
    animal_breed_by_speciesId: createUrl<{ animalSpeciesId: string }, AnimalBreedType[]>(
        '/pets/animal_breed/?fk_animal_species=:animalSpeciesId'
    ),
    animal_breedId: createUrl<{ animalBreedId: string }, AnimalBreedType>('/pets/animal_breed/:animalBreedId/'),
    animal_size: createUrl<null, AnimalSizeType[]>('/pets/animal_size/'),
    animal_sizeId: createUrl<{ animalSizeId: string }, AnimalSizeType>('/pets/animal_size/:animalSizeId/'),
    animal_species: createUrl<null, AnimalSpeciesType[]>('/pets/animal_species/'),
    animal_speciesId: createUrl<{ animalSpeciesId: string }, AnimalSpeciesType>(
        '/pets/animal_species/:animalSpeciesId/'
    ),
    pet: createUrl('/pets/pet/'),
    petId: createUrl<{ petId: string }, PetType>('/pets/pet/:petId/'),
    report_pet: createUrl<{ fk_condominium: string }>('/pets/report/pet/?fk_condominium=:fk_condominium')
}
