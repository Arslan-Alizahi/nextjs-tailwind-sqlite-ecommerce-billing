export interface NavItem {
  id: number
  label: string
  href: string
  parent_id?: number
  type?: NavItemType
  target?: '_blank' | '_self'
  icon?: string
  display_order?: number
  is_active?: boolean
  location?: NavLocation
  created_at?: string
  updated_at?: string
  children?: NavItem[]
  meta?: Record<string, any>
}

export type NavItemType = 'link' | 'dropdown' | 'group' | 'button' | 'page-link'
export type NavLocation = 'header' | 'footer' | 'both'

export interface NavFilter {
  location?: NavLocation
  is_active?: boolean
  parent_id?: number
}