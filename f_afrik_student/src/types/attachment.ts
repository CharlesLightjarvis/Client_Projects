// Type pour les liens externes
export type ExternalLinkType =
  | 'youtube'
  | 'google_drive'
  | 'tiktok'
  | 'vimeo'
  | 'dropbox'
  | 'onedrive'
  | 'other'

// Interface pour un lien externe
export interface ExternalLink {
  url: string
  name: string
  type?: ExternalLinkType
}

// Interface pour un attachement (fichier ou lien)
export interface Attachment {
  id: string
  name: string
  url: string
  type: string // Type de fichier (video, pdf, etc.) ou type de lien
  is_external: boolean
  created_at: string
}
