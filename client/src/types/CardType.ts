export type CardType = {
  id: string
  address_line1_check: string | null
  address_zip_check: string | null
  brand: string
  country: string
  cvc_check: string
  dynamic_last4: string | null
  exp_month: number
  exp_year: number
  funding: string
  last4: string
  name: string | null
  three_d_secure: string
  tokenization_method: string | null
}h