export interface SocialMediaLink {
  id: number
  platform: string
  url: string
  icon: string
  display_order: number
  is_active: number
  created_at: string
  updated_at: string
}

export interface CreateSocialMediaLinkInput {
  platform: string
  url: string
  icon: string
  display_order?: number
  is_active?: number
}

export interface UpdateSocialMediaLinkInput {
  platform?: string
  url?: string
  icon?: string
  display_order?: number
  is_active?: number
}
