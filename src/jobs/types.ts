export type Job = {
  id: string
  source: string
  external_id: string
  company: string | null
  company_domain: string | null
  title: string
  location: string | null
  remote_string: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  seniority: string | null
  url: string
  apply_url: string | null
  description_snippet: string | null
  posted_at: string | null
  selected_at: string
  is_live: number
  status: string
  source_channel: string | null
}
