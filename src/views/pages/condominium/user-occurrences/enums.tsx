export enum UserOccurrenceStatus {
    open = 'open',
    inProgress = 'in_progress',
    resolved = 'resolved',

}

export const UserOccurrenceStatusOptions = {
    [UserOccurrenceStatus.open]: 'Aberto',
    [UserOccurrenceStatus.inProgress]: 'Em Andamento',
    [UserOccurrenceStatus.resolved]: 'Fechado',
}

export enum UserOccurrencePrivacy {
    public = 'public',
    private = 'private',
}

export const UserOccurrencePrivacyOptions = {
    [UserOccurrencePrivacy.public]: 'Público',
    [UserOccurrencePrivacy.private]: 'Privado',
}
